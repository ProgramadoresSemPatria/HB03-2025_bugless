import dotenv from "dotenv";

class EnvLoader {
  private static instance: EnvLoader;
  
  private constructor() {
    dotenv.config();
  }

  static getInstance(): EnvLoader {
    if (!EnvLoader.instance) {
      EnvLoader.instance = new EnvLoader();
    }
    return EnvLoader.instance;
  }

  getEnv(key: string): string {
    return process.env[key] ?? "";
  }
}

export default EnvLoader.getInstance();