import express from "express";
import getConnection from "../database/connect";
import {RowDataPacket} from "mysql2";

const router = require('express').Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  const category = req.query.category;
  if (typeof category != "string") {
    return res.failure("Category is required", "category");
  }
  const connection = await getConnection();
  const [tags] = await connection.query<RowDataPacket[]>(
    `SELECT distinct tag_name
     from post_tag,
          post
     where post.post_id = post_tag.post_id
       and post_category = ?
       and (is_private = false or ? = true)
     union
     SELECT distinct tag_name
     from challenge_tag,
          challenge
     where challenge.challenge_id = challenge_tag.challenge_id
       and category_name = ?`, [category, req.auth, category]);
  return res.success("", tags.map(tag => tag.tag_name));
});

export default router;
