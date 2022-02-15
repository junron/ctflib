import {User} from "../models/user";
import { response, Response } from "express";

declare global {
  namespace Express {
    export interface Request {
      auth?: boolean;
      user?: User;
    }

    interface Response {
      success(message: string, data?: any): void;

      failure(message: string, field?: string): void;
    }
  }
}

response.success = function (message: string, data?: any) {
  this.json({
    success: true,
    message,
    data
  });
};


response.failure = function (message: string, field?: string) {
  this.json({
    success: false,
    message,
    field
  });
};
