import { Router } from "express";
import { verify_token } from "../middlewares/AuthMiddlewares.js";
import {get_messages, upload_file} from "../controllers/MessagesController.js";
import multer from "multer";

const messages_routes = Router();
const upload = multer({ dest: "uploads/files" });

messages_routes.post("/get-messages", verify_token, get_messages);
messages_routes.post("/upload-file", verify_token, upload.single("file"), upload_file);

export default messages_routes;