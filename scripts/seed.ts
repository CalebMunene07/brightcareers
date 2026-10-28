// Loads the starter content and filler images into the database.
// Usage: npm run db:seed   (safe to run again: only adds what's missing)
import { seedStarterContent } from "@/lib/seed";

async function main() {
  const report = await seedStarterContent();
  for (const [what, n] of Object.entries(report)) console.log(`${String(n).padStart(4)}  ${what} added`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
