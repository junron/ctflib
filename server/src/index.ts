import express, {NextFunction} from "express";

const app = express();



app.get("/", (req: express.Request, res: express.Response, next: NextFunction) => {
    res.send("Hello World!");
});


class HttpException extends Error {
  status: number;

  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

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

const port = 8000;

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});


