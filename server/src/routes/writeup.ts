import {NextFunction, Request, Response} from "express";
import {Writeup} from "../models/writeup";
import {Challenge} from "../models/challenge/challenge";
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";
import {exportAndBuildWriteups} from "../util";

const router = require('express').Router({mergeParams: true});

router.get("/search", async (req: Request, res: Response, next: NextFunction) => {
  const q = req.query.q;
  if (typeof q != "string") {
    res.failure("Invalid query", "q");
    return;
  }
  const writeups = await Writeup.search(q, req.auth);
  if (writeups) {
    res.success("Success", writeups);
  } else {
    res.failure("Resource not found", "id");
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
    const challenge = await Challenge.getChallengeByID(writeup.challenge_id);
    if (challenge) {
      writeup.challenge_id = challenge.challenge_id;
      await writeup.createWithTransaction();
      await exportAndBuildWriteups();
      return res.success("Writeup created", writeup);
    } else {
      res.failure("CTF not found", "id");
    }
  } else {
    return res.validationFailure(errors);
  }
});

router.delete("/delete/:writeupID", async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.writeupID);
  if (isNaN(id)) {
    res.failure("Invalid ID", "id");
    return;
  }
  const writeup = await Writeup.getWriteupByID(id, req.auth);
  if (writeup) {
    await writeup.deleteWriteup();
    await exportAndBuildWriteups();
    res.success("Writeup deleted", writeup);
  } else {
    res.failure("Writeup not found", "id");
  }
});

router.post("/edit/:writeupID", async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.writeupID);
  if (isNaN(id)) {
    res.failure("Invalid ID", "id");
    return;
  }
  const writeup = await Writeup.getWriteupByID(id, req.auth);
  if (writeup) {
    const newWriteup = plainToInstance(Writeup, req.body as Writeup, {exposeDefaultValues: true});
    newWriteup.challenge_id = writeup.challenge_id;
    newWriteup.writeup_id = writeup.writeup_id;
    newWriteup.poster_username = writeup.poster_username;
    const errors = await validate(newWriteup);
    if (errors.length > 0) {
      return res.validationFailure(errors);
    }
    const result = await writeup.editWriteup(newWriteup);
    await exportAndBuildWriteups();
    res.success("Writeup edited", result);
  } else {
    res.failure("Writeup not found", "id");
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
