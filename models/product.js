import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Name"],
  },
  description: {
    type: String,
    required: [true, "Please Enter description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter price"],
  },
  stock: {
    type: Number,
    required: [true, "Please Enter stock"],
  },
  images: [{ public_id: String, url: String }],
  category: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Product = mongoose.model("Product", schema);
