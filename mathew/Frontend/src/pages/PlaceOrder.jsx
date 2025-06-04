import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay', response, { headers: { token } });
          if (data.success) {
            setShowSuccess(true);
            setCartItems({});
            setTimeout(() => navigate('/orders'), 4000); 
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find((product) => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case "cod":
          const response = await axios.post(backendUrl + "/api/order/place", orderData, { headers: { token } });
          if (response.data) {
            setCartItems({});
            setTimeout(() => navigate("/orders"), 3000);
          } else {
            toast.error(response.data.message);
          }
          break;

        case 'stripe':
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } });
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
            
          } else {
            toast.error(responseStripe.data.message);
          }
          break;

        case 'razorpay':
          const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, { headers: { token } });
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div>

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
      >
        {/* Left Side */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
          <div className="text-xl sm:text-2xl my-3">
            <Title text1={"DELIVERY"} text2={"INFORMATION"} />
          </div>
          <div className="flex gap-3">
            <input required className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="First name" name="firstName" onChange={onChangeHandler} value={formData.firstName} />
            <input required className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Last name" name="lastName" onChange={onChangeHandler} value={formData.lastName} />
          </div>
          <input required className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="email" placeholder="Email address" name="email" onChange={onChangeHandler} value={formData.email} />
          <input required className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Street" name="street" onChange={onChangeHandler} value={formData.street} />
          <div className="flex gap-3">
            <input required className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="City" name="city" onChange={onChangeHandler} value={formData.city} />
            <input required className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="State" name="state" onChange={onChangeHandler} value={formData.state} />
          </div>
          <div className="flex gap-3">
            <input required className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Zipcode" name="zipcode" onChange={onChangeHandler} value={formData.zipcode} />
            <input required className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Country" name="country" onChange={onChangeHandler} value={formData.country} />
          </div>
          <input required className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Phone" name="phone" onChange={onChangeHandler} value={formData.phone} />
        </div>

        {/* Right Side */}
        <div className="mt-8">
          <div className="mt-8 min-w-80">
            <CartTotal />
          </div>

          <div className="mt-12">
            <Title text1={"PAYMENT"} text2={"METHOD"} />
            <div className="flex gap-3 flex-col lg:flex-row">
              <div onClick={() => setMethod("stripe")} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === "stripe" ? " border-green-700" : ""}`}>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "stripe" ? "bg-green-400 border-green-500" : ""}`}></p>
                <img className=" h-6 w-12 mx-4 pr-2" src={assets.stripe_logo} alt="Stripe" />
              </div>

              <div onClick={() => setMethod("razorpay")} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === "razorpay" ? " border-green-700" : ""}`}>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "razorpay" ? "bg-green-400 border-green-500" : ""}`}></p>
                <img className="h-5 mx-4 pr-9" src={assets.razorpay_logo} alt="Razorpay" />
              </div>

              <div onClick={() => setMethod("cod")} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === "cod" ? " border-green-700" : ""}`}>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400 border-green-500" : ""}`}></p>
                <img className=" h-8 w-8 mx-2 " src={assets.cash_logo} />
                <p className="text-sm">CASH ON DELIVERY</p>
              </div>
            </div>

            <div className="w-full text-end mt-8">
              <button type="submit" className="bg-black text-white px-16 py-3 text-sm">PLACE ORDER</button>
            </div>
          </div>
        </div>
      </form>

      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <DotLottieReact
              src="/animations/payment-success.lottie"
              autoplay
              loop={false}
              style={{ width: 300, height: 300 }}
            />
            <p className="text-center text-xl font-semibold mt-4">Payment Successful!</p>
          </div>
        </div>
      )}
    
    </div>
  );
};

export default PlaceOrder;


