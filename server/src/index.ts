import express, {NextFunction} from "express";
import "./types/express.ext";
import "reflect-metadata";
import config from "./config";
import * as migrations from "./database/migrate";
import auth from "./auth/middleware";
import {HttpException} from "./types/HttpException";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import authRoute from "./routes/auth";
import categoryRoute from "./routes/category";
import resourceRoute from "./routes/resource";
import tagsRoute from "./routes/tags";
import ctfRoute from "./routes/ctf/ctf";
import ctftimeRoute from "./routes/ctf/ctftime";

const app = express();

(async () => {

  await migrations.init();

  app.use(bodyParser.json());

  app.use(cookieParser());

  app.use("/", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://ctflib.junron.dev");
    res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

  app.use("/me", auth(true));

  app.use("/", authRoute);

  app.use("/categories/create", auth(true));
  app.use("/categories", categoryRoute);

  app.use("/resources", auth(false));
  app.use("/resources/create", auth(true));
  app.use("/resources", resourceRoute);

  app.use("/tags", auth(false));
  app.use("/tags", tagsRoute);

  app.use("/ctfs", ctfRoute);
  app.use("/ctftime", ctftimeRoute);

  app.get("/", (req: express.Request, res: express.Response, next: NextFunction) => {
    res.send("Hello World!");
  });


  app.use(
    (
      error: HttpException,
      req: express.Request,
      res: express.Response,
      next: NextFunction,
    ) => {
      if (error.status) {
        res.status(error.status);
      } else {
        res.status(500);
      }
      res.json({
        success: false,
        message: error.message,
      });
      next();
    },
  );


  app.listen(config.port, () => {
    console.log(`server is running at http://localhost:${config.port}`);
  });

})();
