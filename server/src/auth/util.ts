import * as crypto from "crypto";

export function hash(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`)
    .toString(`hex`) + "." + salt;
}

export function verify(password: string, hash: string): boolean {
  if (!hash.includes(".")) {
    return false;
  }
  if (hash.length !== 161) {
    return false;
  }
  const [hashedPassword, salt] = hash.split(".");
  if (hashedPassword.length !== 128) {
    return false;
  }
  return crypto.timingSafeEqual(
    crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`),
    Buffer.from(hashedPassword, "hex")
  );
}
