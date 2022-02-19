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
    return res.failure("User not found", "name");
  }
  if (user.login(password)) {
    res.cookie("token", user.getJWT(), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    });
    res.success("Logged in successfully", user.withoutHash());
  } else {
    res.failure("Incorrect password", "password");
  }
});

router.post("/register", async (req: express.Request, res: express.Response, next: NextFunction) => {
  const {username, email, github, password, secret} = req.body;
  if (secret.length != config.registration_secret.length) {
    return res.failure("Invalid secret", "secret");
  }
  if (!crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(config.registration_secret))) {
    return res.failure("Invalid secret", "secret");
  }
  const user = new User(username, email, github, hash(password));

  if (await res.handleDup(user.create(), "user", "name")) {
    return;
  }

  // This is ok because CORS headers only allow specific sites to send requests
  res.cookie("token", user.getJWT(), {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7
  });

  res.success("Registered successfully");
});

router.get("/me", async (req: Request, res: Response, next: NextFunction) => {
  res.success("User found", req.user);
});

router.post("/logout", async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("token");
  res.success("Logged out successfully");
});

export default router;
