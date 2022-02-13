import {User} from "../models/user";

declare global {
  namespace Express {
    export interface Request {
      auth?: boolean;
      user?: User;
    }
  }
}
