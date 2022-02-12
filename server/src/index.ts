import express, {NextFunction} from "express";
import config from "./config";
import * as migrations from "./database/migrate";

const app = express();

class HttpException extends Error {
  status: number;

  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

(async () => {

  await migrations.init();

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
