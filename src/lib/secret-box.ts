import "server-only";
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "node:crypto";

// Encrypts credentials saved in the admin before they're stored in MongoDB (AES-256-GCM).
// The key is derived from AUTH_SECRET, so changing AUTH_SECRET makes saved secrets unreadable:
// re-enter them in Admin → Settings afterwards.

function key() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET must be set to at least 32 characters");
  return Buffer.from(hkdfSync("sha256", secret, "bridgecareers-settings", "settings-encryption-v1", 32));
}

/** Returns "v1:<iv>:<tag>:<ciphertext>" (base64url parts). */
export function seal(plain: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return ["v1", iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), data.toString("base64url")].join(":");
}

/** Decrypts a value from seal(); returns null if it can't be read (e.g. AUTH_SECRET changed). */
export function open(sealed: string): string | null {
  const [v, iv, tag, data] = sealed.split(":");
  if (v !== "v1" || !iv || !tag || !data) return null;
  try {
    const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64url"));
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    return Buffer.concat([decipher.update(Buffer.from(data, "base64url")), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}
