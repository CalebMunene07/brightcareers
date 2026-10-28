import "server-only";
import { MongoClient, type Db } from "mongodb";

// Reuse one client across hot reloads in development and across requests in production.
const globalForMongo = globalThis as unknown as { mongoClient?: Promise<MongoClient> };

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("MONGODB_URI is not set");
  }
}

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new DatabaseNotConfiguredError();

  globalForMongo.mongoClient ??= new MongoClient(uri).connect();
  const client = await globalForMongo.mongoClient;
  return client.db(process.env.MONGODB_DB ?? "bridgecareers");
}

// Collection names in one place so the admin panel can use the same ones.
export const collections = {
  jobs: "jobs",
  content: "content",
  articles: "articles",
  solutions: "solutions",
  industries: "industries",
  media: "media",
  admins: "admins",
  loginAttempts: "loginAttempts",
  applications: "applications",
  staffRequests: "staffRequests",
  contacts: "contacts",
  cvs: "cvs",
  cvDownloads: "cvDownloads",
  newsletter: "newsletter",
  visaApplications: "visaApplications",
  ticketRequests: "ticketRequests",
  customForms: "customForms",
  formSubmissions: "formSubmissions",
  aiUsage: "aiUsage",
  privacyLog: "privacyLog",
  translations: "translations",
  settings: "settings",
} as const;
