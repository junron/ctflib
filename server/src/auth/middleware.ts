import {Request, NextFunction, Response} from "express";
import * as jwt from "jsonwebtoken";
import config from "../config";
import {User} from "../models/user";

export default async function (req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if (!token) {
    return next(new Error("No token provided"));
  }
  try{
    const decodedToken = jwt.verify(token, config.secret);
    req.auth = true;
    req.user = User.fromJson(decodedToken);
  }catch (e) {
    return next(new Error("Invalid token"));
  }
  next();
}
