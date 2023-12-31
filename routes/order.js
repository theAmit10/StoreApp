import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";
import {
  createOrder,
  getAdminOrders,
  getMyOrders,
  getOrderDetails,
  processOrder,
  processPayment,
} from "../controllers/order.js";


const router = express.Router();

router.post("/new", isAuthenticated, createOrder);
router.post("/payment", isAuthenticated, processPayment);
router.get("/my", isAuthenticated, getMyOrders);
router.get("/admin", isAuthenticated, isAdmin, getAdminOrders);
router
  .route("/single/:id")
  .get(isAuthenticated, getOrderDetails)
  .put(isAuthenticated, isAdmin, processOrder);

export default router;
