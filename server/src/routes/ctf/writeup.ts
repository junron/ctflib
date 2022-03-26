import {NextFunction, Request, Response} from "express";
import {Challenge} from "../../models/challenge/challenge";
import {Writeup} from "../../models/writeup";
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";

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

router.post("/create", async (req: Request, res: Response, next: NextFunction) => {
  const writeup = plainToInstance(Writeup, req.body as Writeup, {exposeDefaultValues: true});
  const user = req.user;
  if (!user) {
    return res.failure("You must be logged in");
  }
  writeup.poster_username = user.username;
  const errors = await validate(writeup);
  if (errors.length == 0) {
    const id = parseInt(req.params.chalID);
    if (isNaN(id)) {
      res.failure("Invalid ID", "id");
      return;
    }
    const challenge = await Challenge.getChallengeByID(id);
    if (challenge) {
      writeup.challenge_id = challenge.challenge_id;
      await writeup.createWithTransaction();
      return res.success("Writeup created", writeup);
    } else {
      res.failure("CTF not found", "id");
    }
  } else {
    return res.validationFailure(errors);
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
