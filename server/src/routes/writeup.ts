import {NextFunction, Request, Response} from "express";
import {Writeup} from "../models/writeup";

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

export default router;
