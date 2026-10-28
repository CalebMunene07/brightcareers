// Create or reset an admin user.
// Usage: npm run admin:create -- <email> <password> [name]
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { promisify } from "node:util";
import { MongoClient } from "mongodb";

const scrypt = promisify(scryptCb);
const [email, password, ...nameParts] = process.argv.slice(2);

if (!email || !password) {
  console.error("Usage: npm run admin:create -- <email> <password> [name]");
  process.exit(1);
}
if (password.length < 10) {
  console.error("Password must be at least 10 characters.");
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set (add it to .env.local).");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = await scrypt(password, salt, 64);
const passwordHash = `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;

const client = await new MongoClient(process.env.MONGODB_URI).connect();
try {
  const admins = client.db(process.env.MONGODB_DB ?? "bridgecareers").collection("admins");
  await admins.createIndex({ email: 1 }, { unique: true });
  const normalized = email.trim().toLowerCase();
  await admins.updateOne(
    { email: normalized },
    {
      $set: { email: normalized, name: nameParts.join(" ") || normalized.split("@")[0], passwordHash, active: true, updatedAt: new Date() },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );
  console.log(`Admin ready: ${normalized}`);
} finally {
  await client.close();
}
