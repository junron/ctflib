import {NextFunction, Request, Response} from "express";
import {CTF} from "../../models/ctf/ctf";
import {Challenge, ChallengeEdit} from "../../models/challenge/challenge";
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";
import multer from "multer";
import {ChallengeFile} from "../../models/challenge/challengeFile";
import {jsonOrNull} from "../../util";

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

function parseChallenge(req: Request) {
  if (req.body.event_id && typeof req.body.event_id == "string") {
    req.body.event_id = parseInt(req.body.event_id);
  }
  if (req.body.points && typeof req.body.points == "string") {
    req.body.points = parseInt(req.body.points);
  }
  if (req.body.tags && typeof req.body.tags == "string") {
    const tags = jsonOrNull(req.body.tags);
    if (!tags) {
      req.body.tags = [];
    } else {
      req.body.tags = tags;
    }
  }
}

router.post("/create", upload.array("files"), async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as Express.Multer.File[];
  parseChallenge(req);
  const challenge = plainToInstance(Challenge, req.body as Challenge, {exposeDefaultValues: true});
  const errors = await validate(challenge);
  if (errors.length == 0) {
    if (files) {
      challenge.files = files.map(file => new ChallengeFile(file.originalname, file.mimetype, file.path));
    }
    if (await res.handleRefViolation(challenge.create(), "category")) {
      return;
    }
    return res.success("Challenge created", challenge);
  } else {
    return res.validationFailure(errors);
  }
});

router.post("/edit/:chalID", upload.array("files"), async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.chalID);
  if (isNaN(id)) {
    res.failure("Invalid ID", "id");
    return;
  }
  parseChallenge(req);
  let challenge = await Challenge.getChallengeByID(id);
  if (!challenge) {
    return res.failure("Challenge not found", "id");
  }
  challenge = (await Challenge.getTagsAndFiles([challenge], true))[0];
  const newChallenge = plainToInstance(Challenge, req.body as Challenge, {exposeDefaultValues: true});
  newChallenge.challenge_id = challenge.challenge_id;
  const errors = await validate(newChallenge);
  if (errors.length != 0) {
    return res.validationFailure(errors);
  }
  const unchangedFiles = jsonOrNull(req.body.unchangedFiles) ?? challenge.files.map(file => file.file_id);
  const newChallengeEdit = Object.assign(newChallenge, {unchangedFiles}) as ChallengeEdit;
  const files = req.files as Express.Multer.File[];
  if (files) {
    newChallenge.files = files.map(file => new ChallengeFile(file.originalname, file.mimetype, file.path));
  } else {
    newChallenge.files = [];
  }
  if (await res.handleRefViolation(challenge.editChallenge(newChallengeEdit), "category")) {
    return;
  }
  return res.success("Challenge edited", newChallenge);
});

router.delete("/delete/:chalID", async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.chalID);
  if (isNaN(id)) {
    res.failure("Invalid ID", "id");
    return;
  }
  let challenge = await Challenge.getChallengeByID(id);
  if (!challenge) {
    return res.failure("Challenge not found", "id");
  }
  challenge = (await Challenge.getTagsAndFiles([challenge], true))[0];
  if (challenge) {
    await challenge.deleteChallenge();
    res.success("Challenge deleted", challenge);
  } else {
    res.failure("Challenge not found", "id");
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

export default router;
