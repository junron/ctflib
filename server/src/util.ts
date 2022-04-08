import * as fs from "fs/promises";

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
