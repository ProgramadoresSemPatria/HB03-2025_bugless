import express, { Request, Response } from "express";
import statusSubmissionRouter from "./src/routes/status-submission.routes";
import envLoader from "./src/services/env-loader.service";
import authRouter from "./src/routes/auth.routes";
import projectRouter from "./src/routes/project.routes";
import submissionRouter from "./src/routes/submission.routes";

const PORT = envLoader.getEnv("PORT") || "3000";

const app = express();

app.use(express.json());

app.use("/status-submissions", statusSubmissionRouter);
app.use("/auth", authRouter);
app.use("/projects", projectRouter);
app.use("/submissions", submissionRouter);

app.get("/", async (req: Request, res: Response) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});