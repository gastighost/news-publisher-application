import { Router, Request, Response } from "express";
import prisma from "../prisma/prisma_config";

const router = Router();

router.get("/test", async (req: Request, res: Response) => {
  res.status(200).json({ message: "Test route is working" });
});

router.get("/test_db", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.status(200).json({ message: "The db is up", users });
});

export default router;
