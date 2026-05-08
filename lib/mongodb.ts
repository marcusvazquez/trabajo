import dns from "node:dns";
import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as {
  mongoClientPromise?: Promise<MongoClient> | null;
};

globalForMongo.mongoClientPromise ??= null;

function applyMongoDnsServers(uri: string) {
  if (!uri.startsWith("mongodb+srv://")) return;
  const servers = process.env.MONGODB_DNS_SERVERS?.split(",").map((s) => s.trim()).filter(Boolean);
  if (servers?.length) {
    dns.setServers(servers);
    return;
  }
  // Algunos routers (DNS local) devuelven ECONNREFUSED a Node en querySrv; DNS público suele corregirlo.
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

export async function getDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("Define MONGODB_URI en tu .env.local");
  }

  applyMongoDnsServers(mongoUri);

  if (!globalForMongo.mongoClientPromise) {
    const client = new MongoClient(mongoUri, {
      serverSelectionTimeoutMS: 15_000,
    });
    globalForMongo.mongoClientPromise = client.connect().catch((error) => {
      globalForMongo.mongoClientPromise = null;
      throw error;
    });
  }

  const client = await globalForMongo.mongoClientPromise;
  const dbName = process.env.MONGODB_DB_NAME ?? "ojo_de_lince";
  return client.db(dbName);
}
