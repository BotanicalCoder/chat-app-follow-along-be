import { Router } from "express";
import { verify_token } from "../middlewares/AuthMiddlewares.js";
import {get_messages} from "../controllers/MessagesController.js";

const messages_routes = Router();

messages_routes.post("/get-messages", verify_token, get_messages);

export default messages_routes;