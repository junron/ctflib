import {NextFunction, Request, Response} from "express";
import {CTF} from "../../models/ctf/ctf";
import {Challenge} from "../../models/challenge/challenge";
import writeupRouter from "./writeup";
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";
import multer from "multer";
import {ChallengeFile} from "../../models/challenge/challengeFile";

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
    res.success("Success", await Challenge.getTagsAndFiles(challenges));
  } else {
    res.failure("CTF not found", "id");
  }
});

const upload = multer({
  dest: "./data/uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/create", upload.array("files"), async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as Express.Multer.File[];
  if (req.body.event_id && typeof req.body.event_id == "string") {
    req.body.event_id = parseInt(req.body.event_id);
  }
  if (req.body.points && typeof req.body.points == "string") {
    req.body.points = parseInt(req.body.points);
  }
  const challenge = plainToInstance(Challenge, req.body as Challenge, {exposeDefaultValues: true});
  const errors = await validate(challenge);
  if (errors.length == 0) {
    if(files){
      challenge.files = files.map(file=> new ChallengeFile(file.originalname, file.mimetype, file.path));
    }
    if (await res.handleRefViolation(challenge.create(), "category")) {
      return;
    }
    return res.success("Challenge created", challenge);
  } else {
    return res.validationFailure(errors);
  }
});

router.use("/:chalID/writeups", writeupRouter);

export default router;
