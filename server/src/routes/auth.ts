import express, {NextFunction} from "express";
import * as crypto from "crypto";
import config from "../config";
import {User} from "../models/user";
import {hash} from "../auth/util";

const router = require('express').Router();

router.post("/login", async (req: express.Request, res: express.Response, next: NextFunction) => {
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
    res.json({
      success: true,
      message: "Logged in successfully"
    });
  } else {
    res.json({
      success: false,
      message: "Incorrect username or password"
    });
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

  res.json({
    success: true,
    message: "User registered"
  });
});

router.get("/me", async (req: express.Request, res: express.Response, next: NextFunction) => {
  const user = req.user;
  if (!user) return next(new Error("Not logged in"));
  res.json({
    success: true,
    message: "Hello, " + user.username,
    user,
  });
});

export default router;
