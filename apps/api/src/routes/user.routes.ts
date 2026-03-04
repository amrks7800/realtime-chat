import { Router } from "express";
import * as userController from "../controllers/user.controller";

const router: Router = Router();

router.get("/search", userController.searchUsers);
router.get("/check-username", userController.checkUsername);
router.get("/profile", userController.getProfile);
router.patch("/profile", userController.updateProfile);

export default router;
