import {NextFunction, Request, Response} from "express";
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";
import {Guide} from "../models/guide";

const router = require('express').Router();

router.get("/get/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.failure("Invalid ID", "id");
    return;
  }
  const guide = await Guide.getGuideById(id, req.auth);
  if (guide) {
    res.success("Success", guide);
  } else {
    res.failure("Guide not found", "id");
  }
});

router.get("/search", async (req: Request, res: Response, next: NextFunction) => {
  const q = req.query.q;
  if (typeof q != "string") {
    res.failure("Invalid query", "q");
    return;
  }
  const guides = await Guide.search(q, req.auth);
  res.success("Success", guides);
});

router.get("/series", async (req: Request, res: Response, next: NextFunction) => {
  const series = await Guide.getSeries();
  res.success("Success", series);
});

router.post("/create", async (req: Request, res: Response, next: NextFunction) => {
  const guide = plainToInstance(Guide, req.body as Guide, {exposeDefaultValues: true});
  const user = req.user;
  if (!user) {
    return res.failure("User not found");
  }
  guide.poster_username = user.username;
  const errors = await validate(guide);
  if (errors.length == 0) {
    if (await res.handleLengthViolation(res.handleRefViolation(guide.createWithTransaction(), "category"))) {
      return;
    }
    return res.success("Guide created", guide);
  } else {
    return res.validationFailure(errors);
  }
});

router.post("/edit/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.failure("Invalid ID", "id");
    return;
  }
  const guide = await Guide.getGuideById(id, req.auth);
  if (guide) {
    const newGuide = plainToInstance(Guide, req.body as Guide, {exposeDefaultValues: true});
    newGuide.post_id = guide.post_id;
    const errors = await validate(newGuide);
    if(errors.length > 0){
      return res.validationFailure(errors);
    }
    if (await res.handleLengthViolation(res.handleRefViolation(guide.editGuide(newGuide), "category"))) {
      return;
    }
    res.success("Guide edited", newGuide);
  } else {
    res.failure("Guide not found", "id");
  }
});


export default router;
