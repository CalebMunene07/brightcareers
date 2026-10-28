import { adminsCollection, verifyPassword } from "@/lib/admin-store";

async function main() {
  const [email, password] = process.argv.slice(2);
  const admin = await (await adminsCollection()).findOne({ email: email.trim().toLowerCase() });
  console.log("database:", process.env.MONGODB_DB ?? "bridgecareers");
  console.log("account found:", !!admin, "| active:", admin?.active);
  console.log("password ok:", admin ? await verifyPassword(password, admin.passwordHash) : false);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
