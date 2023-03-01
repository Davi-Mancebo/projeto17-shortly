import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const configDatabase = {
  connectionString: process.env.DATABASE_URL,
};

const db = new Pool(configDatabase);

export const [USERS, SESSIONS] = [
  "users",
  "sessions",
  "links"
].map((c) => `SELECT * FROM ${c}`);

export default db

