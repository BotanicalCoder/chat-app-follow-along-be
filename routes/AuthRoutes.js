import { Router } from "express";
import {
  signup,
  login,
  get_user_info,
  update_profile,
} from "../controllers/AuthController.js";
import { verify_token } from "../middlewares/AuthMiddlewars.js";

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verify_token, get_user_info);
authRoutes.post("/update-profile", verify_token, update_profile);

export default authRoutes;
