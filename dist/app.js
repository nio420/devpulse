import express, { request } from "express";
import globalErrorHandler from "./utils/GlobalErrorHandler";
import { authRoute } from "./modules/auth/auth.route";
import { issuesRoute } from "./modules/issues/issues.route";
import cors from "cors";
import config from "./config";
const app = express();
app.use(cors({
    origin: config.clientUrl,
    credentials: true
}));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoute);
app.use("/api/issues", issuesRoute);
app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello Developers!", author: "Omit" });
});
app.use(globalErrorHandler);
export default app;
//# sourceMappingURL=app.js.map