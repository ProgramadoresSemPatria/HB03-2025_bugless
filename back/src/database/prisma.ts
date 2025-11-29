import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { DATABASE_URL } from "../config/prisma.config";

type PrismaGlobal = typeof globalThis & {
  prisma?: DatabaseService;
};

const globalForPrisma = globalThis as PrismaGlobal;

class DatabaseService extends PrismaClient {
  private constructor() {

    if (!process.env.POSTGRES_USER || !process.env.POSTGRES_DB) {
       throw new Error("Database credentials missing in .env");
    }

    const pool = new Pool({ connectionString: DATABASE_URL });
    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  static getInstance(): DatabaseService {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new DatabaseService();
    }
    return globalForPrisma.prisma;
  }
}

const prisma = DatabaseService.getInstance();

export default prisma;
