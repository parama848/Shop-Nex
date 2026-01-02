import React, { useContext, useMemo, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


/* ================================
   INITIAL FORM STATE
================================ */
const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  street: "",
  city: "",
  state: "",
  zipcode: "",
  country: "",
  phone: "",
};

const PlaceOrder = () => {
  const {
    products = [],
    cartItems = {},
    backendUrl = "http://localhost:4000",
    token,
    setCartItems,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  /* ================================
     BUILD CART ITEMS (SAFE)
  ================================= */
  const itemsArray = useMemo(() => {
    const arr = [];

    for (const productId of Object.keys(cartItems || {})) {
      const product = products.find((p) => p._id === productId);
      if (!product) continue;

      const price = Number(
        product.pricePerKg ?? product.price ?? product.unitPrice ?? 0
      );
      if (price <= 0) continue;

      const cartVal = cartItems[productId];
      let quantity = 0;

      if (typeof cartVal === "number" || typeof cartVal === "string") {
        quantity = Number(cartVal) || 0;
      } else if (typeof cartVal === "object") {
        for (const k in cartVal) {
          quantity += Number(cartVal[k]) || 0;
        }
      }

      if (quantity <= 0) continue;

      arr.push({
        productId,
        name: product.name,
        price,
        quantity,
        image: product.image,
        lineTotal: price * quantity,
      });
    }

    return arr;
  }, [cartItems, products]);

  const subtotal = itemsArray.reduce((s, i) => s + i.lineTotal, 0);
  const shippingFee = 10;
  const total = subtotal + shippingFee;

  /* ================================
     FORM HANDLERS
  ================================= */
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    if (!form.firstName.trim())
      return toast.error("First name required"), false;
    if (!form.email.trim()) return toast.error("Email required"), false;
    if (!form.street.trim()) return toast.error("Street required"), false;
    if (!form.city.trim()) return toast.error("City required"), false;
    if (!form.phone.trim()) return toast.error("Phone required"), false;
    if (itemsArray.length === 0) return toast.error("Cart is empty"), false;
    return true;
  };

  /* ================================
     PLACE ORDER
  ================================= */
  const placeOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // 🔐 HARD BLOCK if token missing
    if (!token) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    setLoading(true);

    const payload = {
      items: itemsArray,
      amount: total,
      address: {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        street: form.street,
        city: form.city,
        state: form.state,
        zipcode: form.zipcode,
        country: form.country,
        phone: form.phone,
      },
    };

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      /* -------- CASH ON DELIVERY -------- */
      if (paymentMethod === "cod") {
        const res = await axios.post(`${backendUrl}/api/order/place`, payload, {
          headers,
        });

        if (res.data.success) {
          toast.success("Order placed successfully");
          setCartItems({});
          navigate(`/order-success/${res.data.orderId}`);
        } else {
          toast.error(res.data.message || "Order failed");
        }
      }

      /* -------- STRIPE -------- */
      if (paymentMethod === "stripe") {
        const res = await axios.post(
          `${backendUrl}/api/order/stripe`,
          payload,
          { headers }
        );

        if (res.data?.session_url) {
          window.location.href = res.data.session_url;
        } else {
          toast.error(res.data?.message || "Stripe session failed");
        }
      }

      /* -------- RAZORPAY -------- */
      if (paymentMethod === "razorpay") {
        const res = await axios.post(
          `${backendUrl}/api/order/razorpay`,
          payload,
          { headers }
        );

        if (!res.data.success) {
          toast.error(res.data.message || "Razorpay failed");
          return;
        }

        if (!window.Razorpay) {
          toast.error(
            "Razorpay SDK failed to load. Check your internet connection."
          );
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: res.data.order.amount,
          currency: "INR",
          name: "Shop Nex",
          description: "Order Payment",
          order_id: res.data.order.id,
          receipt: res.data.order.receipt,
          handler: async (response) => {
            console.log("Razorpay Response:", response);
            try {
              const verify = await axios.post(
                `${backendUrl}/api/order/verifyRazorpay`,
                response,
                { headers }
              );

              if (verify.data.success) {
                toast.success("Payment successful");
                setCartItems({});
                navigate(`/order-success/${res.data.order.receipt}`);
              } else {
                toast.error("Payment verification failed");
              }
            } catch (error) {
              console.error("Verify API Error:", error);
              toast.error("Payment verification error");
            }
          },
          prefill: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            contact: form.phone,
          },
          theme: {
            color: "#000000",
          },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", function (response) {
          console.error("Payment Failed:", response.error);
          toast.error(response.error.description || "Payment failed");
        });

        rzp.open();
      }
    } catch (err) {
      console.error("placeOrder error:", err?.response || err);
      toast.error(
        err?.response?.data?.message || "Request failed. Please login again."
      );
    } finally {
      setLoading(false);
    }
  };


 

  /* ================================
     UI
  ================================= */
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <form
        onSubmit={placeOrder}
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-6"
      >
        {/* DELIVERY */}
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-8">
            Delivery <span className="text-blue-500">Information</span>
          </h2>

          {/* First + Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              className="input"
              name="firstName"
              value={form.firstName}
              placeholder="First Name"
              onChange={handleChange}
              required
            />
            <input
              className="input"
              name="lastName"
              value={form.lastName}
              placeholder="Last Name"
              onChange={handleChange}
              required
            />
          </div>

          {/* Email + Street */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <input
              className="input"
              name="email"
              value={form.email}
              placeholder="Email Address"
              onChange={handleChange}
              required
            />
            <input
              className="input"
              name="street"
              value={form.street}
              placeholder="Street Address"
              onChange={handleChange}
              required
            />
          </div>

          {/* City + State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <input
              className="input"
              name="city"
              value={form.city}
              placeholder="City"
              onChange={handleChange}
              required
            />
            <input
              className="input"
              name="state"
              value={form.state}
              placeholder="State"
              onChange={handleChange}
              required
            />
          </div>

          {/* Zip + Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <input
              className="input"
              name="zipcode"
              value={form.zipcode}
              placeholder="Zip Code"
              onChange={handleChange}
              required
            />
            <input
              className="input"
              name="country"
              value={form.country}
              placeholder="Country"
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div className="mt-6">
            <input
              className="input"
              name="phone"
              value={form.phone}
              placeholder="Phone Number"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>₹{shippingFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-4">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <h3 className="mt-8 mb-4 text-sm font-medium text-gray-600">
            PAYMENT METHOD
          </h3>

          <div className="grid grid-cols-3 gap-4">
            {["stripe", "cod"].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`border rounded-lg py-3 text-sm font-medium transition ${
                  paymentMethod === method
                    ? "border-black ring-2 ring-black"
                    : "hover:border-gray-400"
                }`}
              >
                {method.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white py-4 mt-8 rounded-lg text-lg font-medium disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
