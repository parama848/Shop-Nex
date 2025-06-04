import mongoose from "mongoose";

// create schema (schema is a structure using that we can create the data in database)

const productSchema = new mongoose.Schema({
    name : {type:String, required:true},
    description : {type:String, required:true},
    price : {type: Number, required:true},
    image : {type: Array, required:true},
    category : {type: String, required:true},
    subCategory : {type: String, required:true},
    sizes : {type: Array, required:true},
    bestseller : {type: Boolean},
    date : {type: Number, required:true}
})

// using above Schema let's create a model

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;