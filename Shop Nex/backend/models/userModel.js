import mongoose from "mongoose";

// Create userSchema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
}, {
  minimize: false
});

// Create model using the schema
const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
