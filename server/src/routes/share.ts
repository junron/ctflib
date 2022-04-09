import {NextFunction, Request, Response} from "express";
import {Writeup} from "../models/writeup";
import xss from "xss";
import {Challenge} from "../models/challenge/challenge";
import {Guide} from "../models/guide";

const router = require('express').Router();

router.get("/writeup/:writeup_slug", async (req: Request, res: Response, next: NextFunction) => {
  const slug = req.params.writeup_slug;
  if (!slug || !slug.includes("-")) {
    res.status(400).send("Invalid writeup slug");
    return;
  }
  const id = parseInt(slug.split("-")[slug.split("-").length - 1]);
  if (!id) {
    res.status(400).send("Invalid writeup slug");
    return;
  }
  const writeup = await Writeup.getWriteupByID(id, req.auth);
  if (!writeup) {
    res.status(404).send("Writeup not found");
    return;
  }
  const challenge = await Challenge.getChallengeByID(writeup.challenge_id);
  const filteredTitle = xss(challenge.name);
  const filteredDescription = xss(challenge.description);
  const filteredAuthor = xss(writeup.poster_username);
  const response = `
    <!-- Primary Meta Tags -->
    <title>${filteredTitle}</title>
    <meta name="title" content="${filteredTitle}">
    <meta name="description" content="${filteredDescription}">
    <meta name="author" content="${filteredAuthor}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://ctflib.junron.dev/">
    <meta property="og:title" content="${filteredTitle}">
    <meta property="og:description" content="${filteredDescription}">
    <meta property="og:author" content="${filteredAuthor}">
    <script>
        location.href = "https://ctflib.junron.dev/#/writeups/${challenge.event_id}/${challenge.challenge_id}/${writeup.writeup_id}";
    </script>
`;
  return res.send(response);

});


router.get("/guide/:guide_slug", async (req: Request, res: Response, next: NextFunction) => {
  const slug = req.params.guide_slug;
  if (!slug || !slug.includes("-")) {
    res.status(400).send("Invalid guide slug");
    return;
  }
  const id = parseInt(slug.split("-")[slug.split("-").length - 1]);
  if (!id) {
    res.status(400).send("Invalid guide slug");
    return;
  }
  const guide = await Guide.getGuideById(id, req.auth);
  if (!guide) {
    res.status(404).send("Guide not found");
    return;
  }
  const filteredTitle = xss(guide.title);
  const filteredDescription = xss(guide.description);
  const filteredAuthor = xss(guide.poster_username);
  const response = `
    <!-- Primary Meta Tags -->
    <title>${filteredTitle}</title>
    <meta name="title" content="${filteredTitle}">
    <meta name="description" content="${filteredDescription}">
    <meta name="author" content="${filteredAuthor}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://ctflib.junron.dev/">
    <meta property="og:title" content="${filteredTitle}">
    <meta property="og:description" content="${filteredDescription}">
    <meta property="og:author" content="${filteredAuthor}">
    <script>
        location.href = "https://ctflib.junron.dev/#/guides/${guide.post_id}";
    </script>
`;
  return res.send(response);

});
export default router;
