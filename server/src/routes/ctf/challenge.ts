import {NextFunction, Request, Response} from "express";
import {CTF} from "../../models/ctf/ctf";
import {Challenge} from "../../models/challenge/challenge";
import writeupRouter from "./writeup";

const router = require('express').Router({mergeParams: true});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.ctfID);
  if (isNaN(id)) {
    res.failure("Invalid ID", "id");
    return;
  }
  const ctf = await CTF.getCTFById(id);
  if (ctf) {
    const challenges = await ctf.getChallenges();
    res.success("Success", await Challenge.getTags(challenges));
  } else {
    res.failure("CTF not found", "id");
  }
});

router.get("/:chalID/writeups", async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.chalID);
  if (isNaN(id)) {
    res.failure("Invalid ID", "id");
    return;
  }
  const challenge = await Challenge.getChallengeByID(id);
  if (challenge) {
    res.success("Success", await challenge.getWriteups(req.auth));
  } else {
    res.failure("CTF not found", "id");
  }
});

router.use("/:chalID/writeups", writeupRouter);

export default router;
