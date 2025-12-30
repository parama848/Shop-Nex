import express from 'express';
import {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct
} from '../controllers/productController.js';

import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import Product from '../models/productModel.js';

const productRouter = express.Router();

// Add product route with authentication and image upload
productRouter.post(
  '/add',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  addProduct
);

// List, single, remove
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);

// ✅ Update product route (Secured)
productRouter.post("/update", adminAuth, async (req, res) => {
  const { id, name, price, category } = req.body;

  try {
    const updated = await Product.findByIdAndUpdate(
      id,
      { name, price, category },
      { new: true }
    );

    if (updated) {
      return res.json({ success: true, message: "Product updated", product: updated });
    } else {
      return res.json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default productRouter;