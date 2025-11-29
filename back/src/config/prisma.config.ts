import { defineConfig } from "prisma/config";
import "dotenv/config";

const USER = process.env.POSTGRES_USER;
const PASSWORD = encodeURIComponent(process.env.POSTGRES_PASSWORD || '');
const HOST = process.env.DB_HOST || 'localhost';
const PORT = process.env.POSTGRES_PORT || '5432';
const DB_NAME = process.env.POSTGRES_DB;

export const DATABASE_URL = `postgresql://${USER}:${PASSWORD}@${HOST}:${PORT}/${DB_NAME}?schema=public`;

export default defineConfig({
  schema: "../../prisma/schema.prisma",
  migrations: {
    path: "../../prisma/migrations",
  },
  datasource: {
    url: DATABASE_URL, 
  },
});
