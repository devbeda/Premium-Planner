import {Router} from "express";
import { signup, login, logout, changePassword, getCurrentUserr } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/signup").post( signup);
router.route("/login").post( login);

router.route("/logout").post(verifyJWT,logout)
router.route("/changepassword").post(verifyJWT,changePassword);
router.route("/getuser").get(verifyJWT,getCurrentUserr)



export default router;
