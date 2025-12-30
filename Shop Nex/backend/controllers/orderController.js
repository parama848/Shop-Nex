import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";

/* ================================
   GLOBAL CONFIG
================================ */
const currency = "inr";
const deliveryCharge = 10;

/* ================================
   PAYMENT GATEWAYS INIT
================================ */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ================================
   CASH ON DELIVERY
================================ */
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ JWT
    const { items, amount, address } = req.body;

    const order = await orderModel.create({
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    });

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.status(201).json({
      success: true,
      orderId: order._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================================
   STRIPE PAYMENT
================================ */
const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;
    const origin = req.headers.origin || "http://localhost:5173";

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const order = await orderModel.create({
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    });

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${origin}/verify?orderId=${order._id}`,
      cancel_url: `${origin}/cart`,
    });

    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================================
   STRIPE VERIFY (TEMP – FRONTEND)
   ⚠️ Use webhook in production
================================ */
const verifyStripe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId, success } = req.body;

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================================
   RAZORPAY PAYMENT
================================ */
const placeOrderRazorpay = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;

    const order = await orderModel.create({
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    });

    const options = {
      amount: Math.round(amount * 100),
      currency: currency.toUpperCase(),
      receipt: order._id.toString(),
    };

    razorpayInstance.orders.create(options, (error, razorpayOrder) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      res.json({
        success: true,
        order: razorpayOrder,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================================
   RAZORPAY VERIFY
   ⚠️ Signature verification recommended
================================ */
const verifyRazorpay = async (req, res) => {
  try {
    const userId = req.user.id;
    const { razorpay_order_id } = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(
      razorpay_order_id
    );

    if (orderInfo.status === "paid") {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });

      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.json({
        success: true,
        message: "Payment Successful",
      });
    } else {
      res.json({
        success: false,
        message: "Payment Failed",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================================
   ADMIN & USER ORDERS
================================ */
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const userOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderModel.find({ userId });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });

    res.json({
      success: true,
      message: "Status updated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================================
   EXPORTS
================================ */
export {
  placeOrder,
  placeOrderStripe,
  verifyStripe,
  placeOrderRazorpay,
  verifyRazorpay,
  allOrders,
  userOrders,
  updateStatus,
};
