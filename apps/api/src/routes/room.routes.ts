import { Router } from "express";
import * as roomController from "../controllers/room.controller";

const router: Router = Router();

router.post("/", roomController.createRoom);
router.get("/my/:userId", roomController.getRooms);
router.get("/:id", roomController.getRoomById);
router.patch("/:id", roomController.updateRoom);
router.delete("/:id", roomController.deleteRoom);

router.post("/:id/participants", roomController.addParticipant);
router.delete("/:id/participants/:userId", roomController.removeParticipant);

export default router;
