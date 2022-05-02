import {CTFTimeEvent} from "../models/ctf/ctftimeEvent";
import axios from "axios";
import {parse} from 'date-format-parse';
import * as JSDOM from "jsdom";
import {Request, Response} from "express";

const router = require('express').Router();

router.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.failure("Invalid ID", "id");
    return;
  }
  const [calendar, html] = (await Promise.all([
      axios.get<string>(`https://ctftime.org/event/${id}.ics`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        }
      }),
      axios.get<string>(`https://ctftime.org/event/${id}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        }
      })])
  ).map(x => x.data);
  const chunks = calendar.split("\n");
  const start = chunks.filter(c => c.includes("DTSTART"))[0].split(":")[1];
  const end = chunks.filter(c => c.includes("DTEND"))[0].split(":")[1];
  const url = chunks.filter(c => c.includes("URL"))[0].split("URL:")[1];
  const startDate = parse(start.replace("T", "").replace("Z", ""), "YYYYMMDDHHmms");
  startDate.setHours(startDate.getHours() + 8);
  const endDate = parse(end.replace("T", "").replace("Z", ""), "YYYYMMDDHHmms");
  endDate.setHours(endDate.getHours() + 8);
  const name = chunks.filter(c => c.includes("DESCRIPTION"))[0].split("DESCRIPTION:")[1].replace(/20\d\d/g, "").trim();
  const dom = new JSDOM.JSDOM(html);
  const doc = dom.window.document;
  const num_teams = parseInt(doc.querySelector("p[align=right]")?.textContent ?? "0");
  const winner_points = parseFloat(
    doc.querySelector(".place.leader")?.parentElement?.querySelector("td.points")?.textContent ?? "0");
  const nushmallows = Array.from(doc.querySelectorAll("a")).filter(a => a.textContent?.includes("NUSHmallows"))[0]
    ?.parentElement?.parentElement;
  const weight = parseFloat(
    Array.from(doc.querySelectorAll("p")).filter(p => p.textContent?.includes("Rating weight"))[0]?.textContent
      ?.split(" ")[2]?.split("\xa0")[0] ?? "0"
  );
  const num_points = parseFloat(nushmallows?.querySelector("td.points")?.textContent ?? "0");
  const rank = parseFloat(nushmallows?.querySelector("td.place")?.textContent ?? "0");
  const image = "https://ctftime.org" + doc.querySelector("img[src^='/media/cache/']")?.getAttribute("src") ?? "";

  res.success("",
    new CTFTimeEvent(name, startDate, endDate, url, name, id, winner_points, num_teams, num_points, rank, weight, image)
  );
});

export default router;