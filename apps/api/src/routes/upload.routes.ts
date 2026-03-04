import { Router } from "express";
import multer from "multer";
import { uploadFile } from "../controllers/upload.controller";

const router: Router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

router.post("/", upload.single("file"), uploadFile);

export default router;
