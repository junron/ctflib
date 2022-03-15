import {NextFunction, Request, Response} from "express";
import {CTF} from "../../models/ctf/ctf";
import {CTFTimeEvent} from "../../models/ctf/ctftimeEvent";

const router = require('express').Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  return res.success("", await CTFTimeEvent.getCTFTimeEvents());
});

router.get("/get/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.failure("Invalid ID", "id");
    return;
  }
  const resource = await CTFTimeEvent.getCTFTimeEventByEventId(id);
  if (resource) {
    res.success("Success", resource);
  } else {
    res.failure("CTFTime event not found", "id");
  }
});


export default router;
