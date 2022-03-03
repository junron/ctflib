import express from "express";
import {Post} from "../models/post";

const router = require('express').Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  const category = req.query.category;
  if (typeof category != "string") {
    return res.failure("Category is required", "category");
  }
  const tags = await Post.getAllTags(category, req.auth);
  return res.success("", tags);
});

export default router;
