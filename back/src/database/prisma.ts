import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import envLoader from "../services/env-loader.service";

type PrismaGlobal = typeof globalThis & {
  prisma?: DatabaseService;
};

const globalForPrisma = globalThis as PrismaGlobal;

class DatabaseService extends PrismaClient {
  private constructor() {

    const databaseUrl = envLoader.getEnv("DATABASE_URL");
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not set");
    }

    const pool = new Pool({ connectionString: databaseUrl });
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