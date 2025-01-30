import express from "express";
import multer from "multer";
import uploadDocument from "../services/uploadDocument.js";
import askQuestion from "../services/askQuestion.js";
import uploadSwagger from "../services/uploadSwagger.js";
import performAction from "../services/performAction.js";

const router = express.Router();

// Configure multer with separate destinations
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const basePath = "uploads/";
    const subfolder = req.path.includes("document") ? "documents/" : "swagger/";
    cb(null, basePath + subfolder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    "/upload-document": ["application/pdf", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    "/upload-swagger": ["application/json", "application/yaml"]
  };
  
  const isValid = allowedTypes[req.path]?.includes(file.mimetype);
  cb(isValid ? null : new Error("Invalid file type"), isValid);
};

const upload = multer({ storage, fileFilter });

// Routes
router.post("/upload-document", upload.single("file"), uploadDocument);
router.post("/ask", askQuestion);
router.post("/upload-swagger", upload.single("file"), uploadSwagger);
router.post("/perform-action", performAction);

export default router;