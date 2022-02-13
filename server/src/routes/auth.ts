import express, {NextFunction, Request, Response} from "express";
import * as crypto from "crypto";
import config from "../config";
import {User} from "../models/user";
import {hash} from "../auth/util";

const router = require('express').Router();

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  const {username, password} = req.body;
  const user = await User.getByUsername(username);
  if (!user) {
    next(new Error("User not found"));
    return;
  }
  if (user.login(password)) {
    res.cookie("token", user.getJWT(), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    });
    res.success("Logged in successfully", user);
  } else {
    res.failure("Incorrect password");
  }
});

router.post("/register", async (req: express.Request, res: express.Response, next: NextFunction) => {
  const {username, email, github, password, secret} = req.body;
  if (secret.length != config.registration_secret.length) {
    next(new Error("Invalid secret"));
    return;
  }
  if (!crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(config.registration_secret))) {
    return next(new Error("Invalid secret"));
  }
  const user = new User(username, email, github, hash(password));
  try {
    await user.register();
  } catch (e) {
    next(e);
    return;
  }

  res.cookie("token", user.getJWT(), {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  });

  res.success("Registered successfully");
});

router.get("/me", async (req: express.Request, res: express.Response, next: NextFunction) => {
  const user = req.user;
  if (!user) return next(new Error("Not logged in"));
  res.success("Hello, " + user.username, user);
});

export default router;
