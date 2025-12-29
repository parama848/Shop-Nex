import React, { useContext, useMemo, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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

  // Build itemsArray robustly (support both qty formats and sizes)
  const itemsArray = useMemo(() => {
    const arr = [];

    for (const productId of Object.keys(cartItems || {})) {
      const product = products.find((p) => p._id === productId) || {};

      // Get numeric price: prefer pricePerKg, then price, then unitPrice
      const rawPrice = product?.pricePerKg ?? product?.price ?? product?.unitPrice ?? 0;
      const price = Number(rawPrice) || 0;

      const cartVal = cartItems[productId];

      // Two shapes:
      // 1) simple number -> qty
      // 2) object of sizes -> { small: 1, large: 2 }
      let qty = 0;
      let sizes;
      if (typeof cartVal === "number" || typeof cartVal === "string") {
        qty = Number(cartVal) || 0;
      } else if (cartVal && typeof cartVal === "object") {
        sizes = {};
        for (const k of Object.keys(cartVal)) {
          const v = Number(cartVal[k]) || 0;
          if (v > 0) {
            sizes[k] = v;
            qty += v;
          }
        }
      }

      const lineTotal = price * qty;

      arr.push({
        productId,
        name: product.name || "Product",
        price,
        qty,
        sizes,
        lineTotal,
      });
    }

    return arr;
  }, [cartItems, products]);

  const subtotal = itemsArray.reduce((s, it) => s + (Number(it.lineTotal) || 0), 0);
  const shippingFee = 10;
  const total = subtotal + shippingFee;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validateForm = () => {
    if (!form.firstName.trim()) return toast.error("First name is required"), false;
    if (!form.email.trim()) return toast.error("Email is required"), false;
    if (!form.street.trim()) return toast.error("Street is required"), false;
    if (!form.city.trim()) return toast.error("City is required"), false;
    if (!form.phone.trim()) return toast.error("Phone is required"), false;
    if (subtotal <= 0) return toast.error("Your cart is empty or has invalid item prices"), false;
    return true;
  };

  const placeOrder = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    // Get userId from localStorage - ensure your login sets this
    const userId = localStorage.getItem("userId") || null;

    if (!userId && !token) {
      setLoading(false);
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    const payload = {
      userId, // may be null if token will be decoded by server
      items: itemsArray.map((it) => ({
        productId: it.productId,
        name: it.name,
        price: it.price,
        qty: it.qty,
        sizes: it.sizes ?? undefined,
        lineTotal: it.lineTotal,
      })),
      amount: Number(total.toFixed(2)), // rupees
      address: {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        street: form.street,
        city: form.city,
        state: form.state,
        zipcode: form.zipcode,
        country: form.country,
        phone: form.phone,
      },
    };

    const headers = token ? { Authorization: `Bearer ${token}`, token } : {};

    console.log("DEBUG placeOrder payload:", payload, "headers:", !!headers.token);

    try {
      // CASH ON DELIVERY
      if (paymentMethod === "cod") {
        const res = await axios.post(`${backendUrl}/api/order/place`, payload, { headers });
        console.log("COD response:", res?.data);

        if (res?.data?.success) {
          toast.success("Order placed (COD)");
          setCartItems({});
          navigate(`/order-success/${res.data.orderId || ""}`);
        } else {
          toast.error(res?.data?.message || "COD failed");
        }
        setLoading(false);
        return;
      }

      // STRIPE
      if (paymentMethod === "stripe") {
        const res = await axios.post(`${backendUrl}/api/order/stripe`, payload, { headers });
        console.log("Stripe create response:", res?.data);

        if (res?.data?.success && res.data.session_url) {
          window.location.href = res.data.session_url;
        } else {
          toast.error(res?.data?.message || "Stripe session failed");
        }
        setLoading(false);
        return;
      }

      // RAZORPAY
      if (paymentMethod === "razorpay") {
        const res = await axios.post(`${backendUrl}/api/order/razorpay`, payload, { headers });
        console.log("Razorpay create response:", res?.data);

        if (!res?.data?.success) {
          toast.error(res?.data?.message || "Failed to create Razorpay order");
          setLoading(false);
          return;
        }

        const rzpOrder = res.data.order;
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || window?.RZP_KEY || "";

        const options = {
          key: razorpayKey,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: "My Shop",
          description: "Order Payment",
          order_id: rzpOrder.id,
          handler: async (response) => {
            try {
              console.log("Razorpay handler response:", response);
              const verify = await axios.post(
                `${backendUrl}/api/order/verifyRazorpay`,
                { razorpay_order_id: response.razorpay_order_id, userId },
                { headers }
              );
              console.log("Razorpay verify response:", verify?.data);

              if (verify?.data?.success) {
                toast.success("Payment Successful");
                setCartItems({});
                navigate(`/order-success/${rzpOrder.receipt || ""}`);
              } else {
                toast.error(verify?.data?.message || "Payment verification failed");
              }
            } catch (err) {
              console.error("verifyRazorpay error:", err);
              toast.error("Payment verification error");
            }
          },
          prefill: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            contact: form.phone,
          },
        };

        if (window.Razorpay) {
          const rp = new window.Razorpay(options);
          rp.open();
        } else {
          toast.error("Razorpay SDK missing. Add script to index.html");
        }

        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("placeOrder error:", err?.response ?? err);
      toast.error(err?.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <form className="space-y-6" onSubmit={placeOrder}>
          <h2 className="text-3xl font-semibold text-gray-700">
            DELIVERY <span className="text-pink-400">INFORMATION</span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" className="border rounded px-4 py-3" />
            <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" className="border rounded px-4 py-3" />
          </div>

          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border rounded px-4 py-3" />
          <input name="street" value={form.street} onChange={handleChange} placeholder="Street" className="w-full border rounded px-4 py-3" />

          <div className="grid grid-cols-2 gap-4">
            <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="border rounded px-4 py-3" />
            <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="border rounded px-4 py-3" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input name="zipcode" value={form.zipcode} onChange={handleChange} placeholder="Zipcode" className="border rounded px-4 py-3" />
            <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="border rounded px-4 py-3" />
          </div>

          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full border rounded px-4 py-3" />
        </form>

        <div>
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">
            CART <span className="text-pink-400">TOTAL</span>
          </h2>

          <div className="bg-white border rounded p-6">
            <div className="flex justify-between py-3 border-b">
              <span>Subtotal</span>
              <span>₹{Number.isFinite(subtotal) ? subtotal.toFixed(2) : "0.00"}</span>
            </div>

            <div className="flex justify-between py-3 border-b">
              <span>Shipping Fee</span>
              <span>₹{shippingFee.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-4">
              <b>Total</b>
              <b>₹{Number.isFinite(total) ? total.toFixed(2) : "0.00"}</b>
            </div>

            <h3 className="mt-6 mb-3 text-sm">PAYMENT <span className="text-pink-400">METHOD</span></h3>

            <div className="grid grid-cols-3 gap-3">
              <label className={`border rounded p-3 ${paymentMethod === "stripe" ? "ring-2 ring-pink-300" : ""}`}>
                <input type="radio" name="pay" checked={paymentMethod === "stripe"} onChange={() => setPaymentMethod("stripe")} />
                <span className="ml-2">Stripe</span>
              </label>

              <label className={`border rounded p-3 ${paymentMethod === "razorpay" ? "ring-2 ring-pink-300" : ""}`}>
                <input type="radio" name="pay" checked={paymentMethod === "razorpay"} onChange={() => setPaymentMethod("razorpay")} />
                <span className="ml-2">Razorpay</span>
              </label>

              <label className={`border rounded p-3 ${paymentMethod === "cod" ? "ring-2 ring-green-300" : ""}`}>
                <input type="radio" name="pay" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                <span className="ml-2 font-medium">Cash on Delivery</span>
              </label>
            </div>

            <button onClick={placeOrder} disabled={loading || subtotal <= 0} className="w-full bg-black text-white py-3 mt-6 rounded disabled:opacity-50">
              {loading ? "Placing order..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
