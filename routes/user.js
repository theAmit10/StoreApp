import express from "express";
import {
  changePassword,
  checkMyProfile,
  forgetPassword,
  getMyProfile,
  logOut,
  login,
  resetPassword,
  signup,
  updatePic,
  updateProfile,
} from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

// router.route("/login").get(login)
router.post("/login", login);

router.post("/new", singleUpload, signup);
router.get("/cmp", checkMyProfile);

router.get("/me", isAuthenticated, getMyProfile);
router.get("/logout", isAuthenticated, logOut);

// Updating Routes
router.put("/updateprofile", isAuthenticated, updateProfile);
router.put("/changepassword", isAuthenticated, changePassword);
router.put("/updatepic", isAuthenticated, singleUpload, updatePic);

// Forget Password and Reset Password

router.route("/forgetpassword").post(forgetPassword).put(resetPassword)

export default router;
