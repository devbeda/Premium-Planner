import {Router} from "express";
import   {saveClients, getClients, deleteClient }  from "../controllers/client.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.route("/saveclient").post(verifyJWT, saveClients);
router.route("/getclients").get( verifyJWT,getClients);
router.route("/deleteclient/:id").delete( verifyJWT,deleteClient);
// router.route("/:id").get(fetchClient);
export default router;
