import { Router } from "express";
import * as messageController from "../controllers/message.controller";

const router: Router = Router();

router.post("/", messageController.sendMessage);
router.get("/:roomId", messageController.getMessages);
router.patch("/:id", messageController.updateMessage);
router.delete("/:id", messageController.deleteMessage);

export default router;
