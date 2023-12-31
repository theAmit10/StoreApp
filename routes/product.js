import express from "express";
import { isAuthenticated, isAdmin } from "../middleware/auth.js";
import { singleUpload } from "../middleware/multer.js";
import {
  addCategory,
  addProductImage,
  createProduct,
  deleteCategory,
  deleteProduct,
  deleteProductImage,
  getAdminProducts,
  getAllCategory,
  getAllProducts,
  getProductDetails,
  updateProduct,
} from "../controllers/product.js";

const router = express.Router();

router.get("/all", getAllProducts);
router.get("/admin", isAuthenticated, isAdmin, getAdminProducts);

router
  .route("/single/:id")
  .get(getProductDetails)
  .put(isAuthenticated, isAdmin, updateProduct)
  .delete(isAuthenticated, isAdmin, deleteProduct);

router.post("/new", isAuthenticated, isAdmin, singleUpload, createProduct);

router
  .route("/images/:id")
  .post(isAuthenticated, isAdmin, singleUpload, addProductImage)
  .delete(isAuthenticated, isAdmin, deleteProductImage);

router.post("/addcategory", isAuthenticated, isAdmin, addCategory);
router.get("/allcategory", getAllCategory);
router.delete("/category/:id", isAuthenticated, isAdmin, deleteCategory);

export default router;
