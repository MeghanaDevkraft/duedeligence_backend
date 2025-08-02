import { Request, Response } from "express";
import { prisma } from "../prisma";

export async function addRule(req: Request, res: Response) {
  const { projectId } = req.params;
  const { sourceModuleId, sourceQuestionId, operator, expectedValue, targetModuleId } = req.body;

  if (!sourceModuleId || !sourceQuestionId || !operator || !expectedValue || !targetModuleId)
    return res.status(400).json({ error: "All rule fields are required" });

  try {
    const rule = await prisma.rule.create({
      data: { projectId, sourceModuleId, sourceQuestionId, operator, expectedValue, targetModuleId }
    });
    res.status(201).json(rule);
  } catch (err) {
    res.status(500).json({ error: "Could not save rule", details: err });
  }
}
