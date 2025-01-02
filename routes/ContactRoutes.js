import { Router } from "express";
import { verify_token } from "../middlewares/AuthMiddlewares.js";
import { search_contacts } from "../controllers/ContactsController.js";

const contacts_routes = Router();

contacts_routes.post("/search", verify_token, search_contacts);

export default contacts_routes;
