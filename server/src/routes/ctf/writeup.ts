import {NextFunction, Request, Response} from "express";
import {CTF} from "../../models/ctf/ctf";
import {Challenge} from "../../models/challenge/challenge";
import {Writeup} from "../../models/writeup";

const router = require('express').Router({mergeParams: true});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
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

router.get("/:writeupID", async (req: Request, res: Response, next: NextFunction) => {
  // Does not check challenge/ctf ID in url matches, but no security risk or unexpected behavior
  const id = parseInt(req.params.writeupID);
  if (isNaN(id)) {
    res.failure("Invalid ID", "id");
    return;
  }
  const writeup = await Writeup.getWriteupByID(id, req.auth);
  if (writeup) {
    res.success("Success", writeup);
  } else {
    res.failure("CTF not found", "id");
  }
});

export default router;
