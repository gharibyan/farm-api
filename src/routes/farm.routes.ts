import { Router } from "express";
import { FarmsController } from "modules/farms/farms.controller";
import { authMiddleware } from "middlewares/auth"
import { wrapAsyncHandler } from "helpers/utils"
const router = Router();
const farmsController = new FarmsController();

router.post("/", [authMiddleware.verifyToken, wrapAsyncHandler(farmsController.create)]);
router.delete("/:farmId", [authMiddleware.verifyToken, wrapAsyncHandler(farmsController.delete)])


export default router;
