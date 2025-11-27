import express, { Request, Response } from "express";
import envLoader from "./src/services/env-loader.service";

const PORT = envLoader.getEnv("PORT")

const app = express();

app.get("/", async (req: Request, res: Response) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});