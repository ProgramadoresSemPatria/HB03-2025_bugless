import express, { Request, Response } from "express";
import cors from "cors";
import statusSubmissionRouter from "./src/routes/status-submission.routes";
import envLoader from "./src/services/env-loader.service";
import authRouter from "./src/routes/auth.routes";
import projectRouter from "./src/routes/project.routes";
import submissionRouter from "./src/routes/submission.routes";
import githubWebhookRouter from "./src/routes/github-webhook.routes";

const PORT = envLoader.getEnv("PORT") || "3000";
const FRONTEND_URL = envLoader.getEnv("FRONTEND_URL") || "http://localhost:3001";

const app = express();

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

// GitHub webhook endpoint MUST come BEFORE express.json()
// This is because we need the raw body to verify the webhook signature
app.use(
  "/webhooks/github",
  express.raw({ type: "application/json" }),
  githubWebhookRouter
);

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
