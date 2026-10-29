import { MongoClient } from "mongodb";

const clusters = [
  ["NEW", process.env.MONGODB_URI],
  ["OLD", process.env.OLDURI],
];

for (const [name, uri] of clusters) {
  const client = await new MongoClient(uri).connect();
  const list = await client.db().admin().listDatabases();
  const names = list.databases.map((d) => d.name).filter((n) => ["admin", "local"].indexOf(n) < 0);
  for (const n of names) {
    const db = client.db(n);
    const admins = await db.collection("admins").countDocuments();
    const attempts = await db.collection("loginAttempts").countDocuments();
    console.log(name, n, "| admins:", admins, "| loginAttempts:", attempts);
  }
  await client.close();
}
