import {NextFunction, Request, Response} from "express";
import {Writeup} from "../models/writeup";
import xss from "xss";
import {Challenge} from "../models/challenge/challenge";
import multer from 'multer';
import {ImgurClient} from "imgur";
import config from "../config";
import {CTF} from "../models/ctf/ctf";
import {ChallengeFile} from "../models/challenge/challengeFile";
import * as fs from "fs";
import * as path from "path";

const router = require('express').Router();

router.get("/:fileID", async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.fileID);
  if (isNaN(id)) {
    res.failure("Invalid ID", "id");
    return;
  }
  const file = await ChallengeFile.getFileByID(id);
  if (file) {
    const filePath = path.join("./", file.file_path);
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-disposition', 'attachment; filename=' + file.file_name);
      res.contentType(file.file_type);
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.failure("File not found", "file");
    }
  } else {
    res.failure("File not found", "id");
  }
});

export default router;
