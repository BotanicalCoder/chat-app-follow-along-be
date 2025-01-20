import { Router } from "express";
import { verify_token } from "../middlewares/AuthMiddlewares.js";
import { search_contacts, get_contacts_for_dm_list } from "../controllers/ContactsController.js";

const contacts_routes = Router();

contacts_routes.post("/search", verify_token, search_contacts);
contacts_routes.get("/get-contacts-for-dm", verify_token, get_contacts_for_dm_list);

export default contacts_routes;
