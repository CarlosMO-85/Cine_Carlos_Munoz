import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB || 'cine-db';

if (!uri) {
  throw new Error('MONGODB_URI no está configurada');
}

export const mongoClient = new MongoClient(uri);
let database;

export async function connectDB() {
  await mongoClient.connect();
  database = mongoClient.db(databaseName);
  return database;
}

export function getDB() {
  if (!database) {
    throw new Error('La base de datos no ha sido conectada');
  }
  return database;
}
