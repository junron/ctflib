import {NextFunction, Request, Response} from "express";
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";
import {Resource} from "../models/resource";

const router = require('express').Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const resources = await Resource.getResources(req.auth);
  return res.success("", resources);
});

router.get("/get/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.failure("Invalid ID", "id");
    return;
  }
  const resource = await Resource.getResourceById(id, req.auth);
  if (resource) {
    res.success("Success", resource);
  } else {
    res.failure("Resource not found", "id");
  }
});

router.post("/create", async (req: Request, res: Response, next: NextFunction) => {
  const resource = plainToInstance(Resource, req.body as Resource, {exposeDefaultValues: true});
  const user = req.user;
  if (!user) {
    return res.failure("User not found");
  }
  resource.poster_username = user.username;
  const errors = await validate(resource);
  if (errors.length == 0) {
    if (await res.handleRefViolation(resource.createWithTransaction(), "category")) {
      return;
    }
    return res.success("Resource created", resource);
  } else {
    return res.validationFailure(errors);
  }
});

export default router;
