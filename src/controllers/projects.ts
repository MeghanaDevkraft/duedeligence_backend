import { Request, Response } from "express";
import { prisma } from "../prisma";

export async function createProject(req: Request, res: Response) {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Project name is required" });

  try {
    const project = await prisma.project.create({ data: { name } });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: "Could not create project", details: err });
  }
}

export async function getProjects(_req: Request, res: Response) {
  try {
    const projects = await prisma.project.findMany({
      include: { modules: { include: { module: true } }, rules: true }
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch projects", details: err });
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
