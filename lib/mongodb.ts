import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as {
  mongoClientPromise?: Promise<MongoClient> | null;
};

globalForMongo.mongoClientPromise ??= null;

export async function getDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("Define MONGODB_URI en tu .env.local");
  }

  if (!globalForMongo.mongoClientPromise) {
    const client = new MongoClient(mongoUri);
    globalForMongo.mongoClientPromise = client.connect();
  }

  const client = await globalForMongo.mongoClientPromise;
  const dbName = process.env.MONGODB_DB_NAME ?? "ojo_de_lince";
  return client.db(dbName);
}
