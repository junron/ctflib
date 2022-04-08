import {NextFunction, Request, Response} from "express";
import multer from 'multer';
import {ImgurClient} from "imgur";
import config from "../config";

const router = require('express').Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

const client = new ImgurClient({clientId: config.client_id});

router.post("/", upload.single("file"), async (req: Request, res: Response, next: NextFunction) => {
  const file = req.file;
  if (!file) return res.failure("No file uploaded", "file");
  client.upload({image: file.buffer})
    .then(function (json) {
      res.success("Image uploaded successfully", json.data.link);
    })
    .catch(function (err) {
      res.failure(err);
    });
});

export default router;
