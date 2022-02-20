import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import config from "../config";
import {User} from "../models/user";

export default function (error = true) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.auth) return next();

    // Debug
    if (req.query.noAuth) {
      if (error) {
        return next(new Error("Debug: anonymous request not allowed on this route"));
      } else {
        req.auth = false;
        req.user = undefined;
        return next();
      }
    }


    const token = req.cookies.token;
    if (!token) {
      if (error) {
        return next(new Error("No token provided"));
      } else {
        req.auth = false;
        req.user = undefined;
        return next();
      }
    }
    try {
      const decodedToken = jwt.verify(token, config.secret);
      req.auth = true;
      req.user = User.fromJson(decodedToken);
    } catch (e) {
      if (error) {
        return next(new Error("Invalid token"));
      } else {
        req.auth = false;
        req.user = undefined;
        return next();
      }
    }
    next();
  };
}
