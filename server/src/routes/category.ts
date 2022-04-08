import {NextFunction, Request, Response} from "express";
import {plainToInstance} from "class-transformer";
import {Category} from "../models/category";
import {validate} from "class-validator";

const router = require('express').Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const categories = await Category.getAll();
  return res.success("Fetched categories", categories);
});

router.post("/create", async (req: Request, res: Response, next: NextFunction) => {
  const category = plainToInstance(Category, req.body as Category, {exposeDefaultValues: true});
  const errors = await validate(category);
  if (errors.length == 0) {
    if (await res.handleDup(category.create(), "category", "name")) {
      return;
    }
    return res.success("Category created", category);
  } else {
    return res.validationFailure(errors);
  }
});

export default router;
