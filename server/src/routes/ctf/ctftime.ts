import {NextFunction, Request, Response} from "express";
import {CTFTimeEvent} from "../../models/ctf/ctftimeEvent";
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";
import {CTF} from "../../models/ctf/ctf";

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

router.post("/create", async (req: Request, res: Response, next: NextFunction) => {
  const ctftimeEvent = plainToInstance(CTFTimeEvent, req.body as CTFTimeEvent, {exposeDefaultValues: true});
  ctftimeEvent.start_date = new Date(ctftimeEvent.start_date);
  ctftimeEvent.end_date = new Date(ctftimeEvent.end_date);
  const errors = await validate(ctftimeEvent);
  if (errors.length == 0) {
    if (await res.handleRefViolation(ctftimeEvent.create(), "ctf_name")) {
      return;
    }
    return res.success("CTF created", ctftimeEvent);
  } else {
    return res.validationFailure(errors);
  }
});

router.post("/edit/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.failure("Invalid ID", "id");
    return;
  }
  const ctfTimeEvent = await CTFTimeEvent.getCTFTimeEventByEventId(id);
  if (ctfTimeEvent) {
    const newCTFTimeEvent = plainToInstance(CTFTimeEvent, req.body as CTFTimeEvent, {exposeDefaultValues: true});
    newCTFTimeEvent.start_date = new Date(newCTFTimeEvent.start_date);
    newCTFTimeEvent.end_date = new Date(newCTFTimeEvent.end_date);
    const errors = await validate(newCTFTimeEvent);
    if(errors.length > 0){
      return res.validationFailure(errors);
    }
    newCTFTimeEvent.event_id = ctfTimeEvent.event_id;
    if (await res.handleRefViolation(ctfTimeEvent.editCTFTimeEvent(newCTFTimeEvent), "ctf_name")) {
      return;
    }
    res.success("CTF edited", newCTFTimeEvent);
  } else {
    res.failure("CTF not found", "id");
  }
});

export default router;
