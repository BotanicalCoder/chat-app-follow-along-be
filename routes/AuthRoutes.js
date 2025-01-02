import { Router } from "express";
import {
  signup,
  login,
  get_user_info,
  update_profile,
  add_profile_image,
  remove_profile_image,
  logout,
} from "../controllers/AuthController.js";
import { verify_token } from "../middlewares/AuthMiddlewars.js";

import multer from "multer";

const upload = multer({ dest: "uploads/profiles" });

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verify_token, get_user_info);
authRoutes.post("/update-profile", verify_token, update_profile);
authRoutes.post(
  "/add-profile-image",
  verify_token,
  upload.single("profile-image"),
  add_profile_image
);

authRoutes.delete("/delete-profile-image", verify_token, remove_profile_image);
authRoutes.post("/logout", logout);

export default authRoutes;
