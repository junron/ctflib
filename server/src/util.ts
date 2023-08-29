import * as fs from "fs/promises";
import {Writeup} from "./models/writeup";
import config from "./config";
import path from "path";
import * as child_process from "child_process";

export function jsonOrNull(json: string): any | null {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

export async function safeUnlink(path: string): Promise<void> {
  try {
    await fs.unlink(path);
  } catch (e) {
    // ignore
  }
}

export function slugify(x: string) {
  return x.toLowerCase().trim().replace(/ /g, "-").replace(/[^\w-]+/g, "");
}

export async function exportAndBuildWriteups() {
  const writeups = await Writeup.exportWriteups();

  await Promise.all(writeups.map(writeup => {
    const filePath = config.writeups_dir + writeup.path;
    return fs.mkdir(path.dirname(filePath)).catch(() => null).finally(() => {
      return fs.writeFile(filePath, writeup.markdown);
    });
  }));

  const child = child_process.spawn("vitepress", ["build", path.join(config.writeups_dir, "../../blog")], {
    cwd: path.join(config.writeups_dir, "../..")
  });
  child.stdout.on("data", data=>{
    console.log('stdout: ' + data);
  });
  child.stderr.on("data", data=>{
    console.log('stderr: ' + data);
  });
  child.on("error", function (err) {
    console.log("Error", err);
  });

}