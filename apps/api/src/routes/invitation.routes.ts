import { Router } from "express";
import * as invitationController from "../controllers/invitation.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router: Router = Router();

router.use(authMiddleware);

router.post("/", invitationController.sendInvitation);
router.get("/my", invitationController.getMyInvitations);
router.patch("/:id", invitationController.respondToInvitation);

export default router;
