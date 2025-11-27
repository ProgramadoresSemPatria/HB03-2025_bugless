import express, { Request, Response } from "express";
import statusSubmissionRouter from "./src/routes/status-submission.routes";
import envLoader from "./src/services/env-loader.service";
import authRouter from "./src/routes/auth.routes";

const PORT = envLoader.getEnv("PORT")

const app = express();

app.use(express.json());

app.use("/status-submissions", statusSubmissionRouter);
app.use("/auth", authRouter);

app.get("/", async (req: Request, res: Response) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});