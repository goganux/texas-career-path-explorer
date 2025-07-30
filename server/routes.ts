import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for career path explorer
  const apiPrefix = "/api";
  
  // Get student profile
  app.get(`${apiPrefix}/student/:id`, async (req, res) => {
    try {
      const studentId = parseInt(req.params.id);
      const student = await storage.getStudent(studentId);
      
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: "Error fetching student profile" });
    }
  });
  
  // Get all career interests
  app.get(`${apiPrefix}/interests`, async (req, res) => {
    try {
      const interests = await storage.getAllCareerInterests();
      res.json(interests);
    } catch (error) {
      res.status(500).json({ message: "Error fetching career interests" });
    }
  });
  
  // Get pathways for a specific interest
  app.get(`${apiPrefix}/pathways/:interestId`, async (req, res) => {
    try {
      const interestId = parseInt(req.params.interestId);
      const pathways = await storage.getPathwaysByInterest(interestId);
      
      res.json(pathways);
    } catch (error) {
      res.status(500).json({ message: "Error fetching pathways" });
    }
  });
  
  // Get detailed info for a specific pathway
  app.get(`${apiPrefix}/pathway/:id`, async (req, res) => {
    try {
      const pathwayId = parseInt(req.params.id);
      const pathway = await storage.getCareerPathway(pathwayId);
      
      if (!pathway) {
        return res.status(404).json({ message: "Pathway not found" });
      }
      
      res.json(pathway);
    } catch (error) {
      res.status(500).json({ message: "Error fetching pathway details" });
    }
  });
  
  // Get student progress for a specific interest
  app.get(`${apiPrefix}/progress/:studentId/:interestId`, async (req, res) => {
    try {
      const studentId = parseInt(req.params.studentId);
      const interestId = parseInt(req.params.interestId);
      
      const progress = await storage.getStudentProgress(studentId, interestId);
      
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Error fetching student progress" });
    }
  });
  
  // Get job market trends for a specific interest
  app.get(`${apiPrefix}/job-market-trends/:interestId`, async (req, res) => {
    try {
      const interestId = parseInt(req.params.interestId);
      const marketData = await storage.getJobMarketTrends(interestId);
      
      res.json(marketData);
    } catch (error) {
      res.status(500).json({ message: "Error fetching job market trends" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
