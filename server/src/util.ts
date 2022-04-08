export function jsonOrNull(json: string): any | null {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}
