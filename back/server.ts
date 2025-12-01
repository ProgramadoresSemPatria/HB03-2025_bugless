import express, { Request, Response } from "express";
import statusSubmissionRouter from "./src/routes/status-submission.routes";
import envLoader from "./src/services/env-loader.service";
import authRouter from "./src/routes/auth.routes";
import userRouter from "./src/routes/user.routes";
import userAuthRouter from "./src/routes/auth-login.routes";
import StatusPlanRouter from "./src/routes/status.plan.routes";
import SubmissionRouter from "./src/routes/submission.routes";
import ProjectRouter from "./src/routes/project.routes";
import SubscriptionRouter from "./src/routes/subscription.routes";
import PlanRouter from "./src/routes/plan.router";
import ReviewRouter from "./src/routes/review.routes";
const PORT = envLoader.getEnv("PORT")

const app = express();

app.use(express.json());
app.use("/users", userRouter)
app.use("/status-submissions", statusSubmissionRouter);
app.use("/auth", authRouter);
app.use("/status-plan", StatusPlanRouter);
app.use("/submission", SubmissionRouter);
app.use("/project", ProjectRouter);
app.use("/subscription", SubscriptionRouter)
app.use("/plan", PlanRouter);
app.use("/review", ReviewRouter)

app.get("/", async (req: Request, res: Response) => {
  res.send("API is running");
});
app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "OK" });
});
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});