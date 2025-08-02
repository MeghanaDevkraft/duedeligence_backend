import { Request, Response } from "express";
import { prisma } from "../prisma";

// Create Module
export async function createModule(req: Request, res: Response) {
  console.log("Creating module with data:", req.body);
  const { name, surveyJson } = req.body;
  if (!name) return res.status(400).json({ error: "Module name is required" });

  try {
    console.log("Attempting to create module in database...");
    const module = await prisma.module.create({
      data: { name, surveyJson: surveyJson || {} }
    });
    console.log("Module created successfully:", module);
    res.status(201).json(module);
  } catch (err) {
    console.error("Error creating module:", err);
    res.status(500).json({ error: "Could not create module", details: err });
  }
}

// Get All Modules
export async function getModules(_req: Request, res: Response) {
  console.log("Getting all modules...");
  try {
    const modules = await prisma.module.findMany();
    console.log("Modules retrieved successfully:", modules);
    res.json(modules);
  } catch (err) {
    console.error("Error getting modules:", err);
    res.status(500).json({ error: "Could not retrieve modules", details: err });
  }
}

// Get Single Module by ID
export async function getModuleById(req: Request, res: Response) {
  const { id } = req.params;
  console.log("Getting module by ID:", id);
  
  try {
    const module = await prisma.module.findUnique({
      where: { id }
    });
    
    if (!module) {
      console.log("Module not found for ID:", id);
      return res.status(404).json({ error: "Module not found" });
    }
    
    console.log("Module retrieved successfully:", module);
    res.json(module);
  } catch (err) {
    console.error("Error getting module by ID:", err);
    res.status(500).json({ error: "Could not retrieve module", details: err });
  }
}

// Update Module
export async function updateModule(req: Request, res: Response) {
  const { id } = req.params;
  const { name, surveyJson } = req.body;
  console.log("Updating module:", { id, name, surveyJson });
  
  if (!name) return res.status(400).json({ error: "Module name is required" });

  try {
    const module = await prisma.module.update({
      where: { id },
      data: { name, surveyJson: surveyJson || {} }
    });
    
    console.log("Module updated successfully:", module);
    res.json(module);
  } catch (err) {
    console.error("Error updating module:", err);
    res.status(500).json({ error: "Could not update module", details: err });
  }
}
