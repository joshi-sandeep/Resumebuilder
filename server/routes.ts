import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { resumeSchema } from "@shared/schema";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export function registerRoutes(app: Express): Server {
  app.post("/api/resume", async (req, res) => {
    try {
      const data = resumeSchema.parse(req.body);
      const resume = await storage.createResume({
        personalInfo: JSON.stringify(data.personalInfo),
        education: JSON.stringify(data.education),
        experience: JSON.stringify(data.experience),
        skills: JSON.stringify(data.skills),
        projects: JSON.stringify(data.projects),
        certificates: JSON.stringify(data.certificates),
        profileImage: data.profileImage
      });
      res.json(resume);
    } catch (error) {
      res.status(400).json({ error: "Invalid resume data" });
    }
  });

  app.get("/api/resume/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const resume = await storage.getResume(id);
    if (!resume) {
      res.status(404).json({ error: "Resume not found" });
      return;
    }
    res.json(resume);
  });

  app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    // In a real app, we'd upload to S3/cloudinary here
    const fileUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    res.json({ url: fileUrl });
  });

  const httpServer = createServer(app);
  return httpServer;
}
