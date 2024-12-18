import { Router } from "express";
import { signup, login, get_user_info } from "../controllers/AuthController.js";
import { verify_token } from "../middlewares/AuthMiddlewars.js";

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verify_token, get_user_info);

export default authRoutes;
