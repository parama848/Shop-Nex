import express from "express";

import {
   placeOrder,
   placeOrderStripe,
   placeOrderRazorpay,
   userOrders,
   verifyStripe,
   verifyRazorpay,
   allOrders,
   updateStatus
} from "../controllers/orderController.js";

import protect from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRouter = express.Router();

/* ================================
   USER ORDER ROUTES
================================ */
orderRouter.post("/place", protect, placeOrder);
orderRouter.post("/stripe", protect, placeOrderStripe);
orderRouter.post("/razorpay", protect, placeOrderRazorpay);

orderRouter.get("/userorders", protect, userOrders);

/* ================================
   PAYMENT VERIFICATION
================================ */
orderRouter.post("/verifyStripe", protect, verifyStripe);
orderRouter.post("/verifyRazorpay", protect, verifyRazorpay);

/* ================================
   ADMIN ORDER ROUTES
================================ */
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

export default orderRouter;
