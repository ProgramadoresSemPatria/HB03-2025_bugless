import envLoader from "../services/env-loader.service";

export const redisConnection = {
    host: envLoader.getEnv("REDIS_HOST") || "localhost",
    port: parseInt(envLoader.getEnv("REDIS_PORT") || "6379"),
    password: envLoader.getEnv("REDIS_PASSWORD")
  };