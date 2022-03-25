import {NextFunction, Request, Response} from "express";
import {CTF} from "../../models/ctf/ctf";
import challengeRouter from "./challenge";

const router = require('express').Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const includeCTFTime = !!req.params.includeCTFTime;
  return res.success("", await CTF.getCTFs(includeCTFTime));
});

router.get("/get/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.failure("Invalid ID", "id");
    return;
  }
  const ctf = await CTF.getCTFById(id);
  if (ctf) {
    res.success("Success", ctf);
  } else {
    res.failure("CTF not found", "id");
  }
});

router.use("/get/:ctfID/challenges", challengeRouter);

export default router;
