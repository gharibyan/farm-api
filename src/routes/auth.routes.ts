import { Router } from "express";
import { AuthController } from "modules/auth/auth.controller";
import { wrapAsyncHandler } from "helpers/utils"


const router = Router();
const authController = new AuthController();

router.post("/login", wrapAsyncHandler(authController.login));

export default router;
