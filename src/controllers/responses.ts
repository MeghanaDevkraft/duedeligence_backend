import { Request, Response } from "express";
import { prisma } from "../prisma";

export async function submitResponses(req: Request, res: Response) {
  const { projectId, answers } = req.body;
  if (!projectId || !Array.isArray(answers) || answers.length === 0)
    return res.status(400).json({ error: "Invalid payload" });

  try {
    const data = answers.map((a: any) => ({
      projectId,
      moduleId: a.moduleId,
      questionId: a.questionId,
      answerValue: a.answerValue,
    }));
    await prisma.answer.createMany({ data });

    res.json({ message: "Answers saved" });
  } catch (err) {
    res.status(500).json({ error: "Could not save answers", details: err });
  }
}

export async function getResponsesByProject(req: Request, res: Response) {
  const { projectId } = req.params;
  try {
    const answers = await prisma.answer.findMany({
      where: { projectId },
      include: { module: true },
    });
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch responses", details: err });
  }
}
