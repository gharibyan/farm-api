import { Router } from "express";
import { UsersController } from "modules/users/users.controller";
import { wrapAsyncHandler } from "helpers/utils"


const router = Router();
const usersController = new UsersController();

router.post("/", wrapAsyncHandler(usersController.create));

export default router;
