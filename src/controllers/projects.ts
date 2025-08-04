import { Request, Response } from "express";
import { prisma } from "../prisma";

export async function createProject(req: Request, res: Response) {
  const { name, modules } = req.body;
  if (!name) return res.status(400).json({ error: "Project name is required" });

  try {
    // Step 1: Create project
    const project = await prisma.project.create({
      data: {
        name,
        modules: modules ? {
          create: modules.map((mod: any) => ({
            module: {
              connect: { id: mod.moduleId }
            }
          }))
        } : undefined
      },
      include: {
        modules: {
          include: {
            module: true
          }
        }
      }
    });

    // Step 2: Update modules with project-specific surveyJson and conditions
    if (modules && Array.isArray(modules)) {
      for (const mod of modules) {
        if (mod.surveyJson || mod.condition) {
          await prisma.module.update({
            where: { id: mod.moduleId },
            data: {
              surveyJson: mod.surveyJson || {},
              condition: mod.condition || null
            }
          });
        }
      }
    }

    res.status(201).json(project);
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: "Could not create project", details: err });
  }
}

export async function getProjects(_req: Request, res: Response) {
  try {
    const projects = await prisma.project.findMany({
      include: { 
        modules: { 
          include: { module: true } 
        }, 
        rules: true 
      }
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch projects", details: err });
  }
}

export async function getProject(req: Request, res: Response) {
  const { projectId } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { 
        modules: { 
          include: { module: true } 
        }, 
        rules: true 
      }
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch project", details: err });
  }
}

export async function updateProject(req: Request, res: Response) {
  const { projectId } = req.params;
  const { name, modules } = req.body;

  if (!name) return res.status(400).json({ error: "Project name is required" });

  try {
    // Step 1: Delete previous connections
    await prisma.projectModule.deleteMany({
      where: { projectId }
    });

    // Step 2: Update project name
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        modules: modules ? {
          create: modules.map((mod: any) => ({
            module: {
              connect: { id: mod.moduleId }
            }
          }))
        } : undefined
      },
      include: {
        modules: {
          include: {
            module: true
          }
        }
      }
    });

    // Step 3: Update modules with project-specific surveyJson and conditions
    if (modules && Array.isArray(modules)) {
      for (const mod of modules) {
        if (mod.surveyJson || mod.condition) {
          await prisma.module.update({
            where: { id: mod.moduleId },
            data: {
              surveyJson: mod.surveyJson || {},
              condition: mod.condition || null
            }
          });
        }
      }
    }

    res.json(project);
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: "Could not update project", details: err });
  }
}

export async function deleteProject(req: Request, res: Response) {
  const { projectId } = req.params;

  try {
    // Delete related records first
    await prisma.answer.deleteMany({
      where: { projectId }
    });

    await prisma.rule.deleteMany({
      where: { projectId }
    });

    await prisma.projectModule.deleteMany({
      where: { projectId }
    });

    // Delete the project
    await prisma.project.delete({
      where: { id: projectId }
    });

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Could not delete project", details: err });
  }
}

export async function attachModules(req: Request, res: Response) {
  const { projectId } = req.params;
  const { moduleIds } = req.body;
  if (!Array.isArray(moduleIds) || !moduleIds.length)
    return res.status(400).json({ error: "moduleIds must be a non-empty array" });

  try {
    const data = moduleIds.map((modId: string) => ({ projectId, moduleId: modId }));
    await prisma.projectModule.createMany({ data, skipDuplicates: true });
    res.json({ message: "Modules attached to project" });
  } catch (err) {
    res.status(500).json({ error: "Could not attach modules", details: err });
  }
}
