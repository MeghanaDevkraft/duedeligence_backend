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

export async function submitSingleResponse(req: Request, res: Response) {
  const { projectId, moduleId, questionId, answerValue } = req.body;
  
  if (!projectId || !moduleId || !questionId || answerValue === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check if answer already exists
    const existingAnswer = await prisma.answer.findFirst({
      where: {
        projectId,
        moduleId,
        questionId
      }
    });

    if (existingAnswer) {
      // Update existing answer
      const updatedAnswer = await prisma.answer.update({
        where: { id: existingAnswer.id },
        data: { answerValue: String(answerValue) }
      });
      res.json(updatedAnswer);
    } else {
      // Create new answer
      const newAnswer = await prisma.answer.create({
        data: {
          projectId,
          moduleId,
          questionId,
          answerValue: String(answerValue)
        }
      });
      res.json(newAnswer);
    }
  } catch (err) {
    console.error("Error saving answer:", err);
    res.status(500).json({ error: "Could not save answer", details: err });
  }
}

export async function getResponsesByProject(req: Request, res: Response) {
  const { projectId } = req.params;
  try {
    const answers = await prisma.answer.findMany({
      where: { projectId },
      include: { module: true },
      orderBy: { id: 'asc' }
    });
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch responses", details: err });
  }
}

export async function getResponsesByModule(req: Request, res: Response) {
  const { projectId, moduleId } = req.params;
  try {
    const answers = await prisma.answer.findMany({
      where: { 
        projectId,
        moduleId 
      },
      orderBy: { id: 'asc' }
    });
    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch module responses", details: err });
  }
}

export async function deleteResponsesByProject(req: Request, res: Response) {
  const { projectId } = req.params;
  try {
    await prisma.answer.deleteMany({
      where: { projectId }
    });
    res.json({ message: "All responses deleted for project" });
  } catch (err) {
    res.status(500).json({ error: "Could not delete responses", details: err });
  }
}
