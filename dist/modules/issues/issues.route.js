import { Router } from "express";
import { createIssue, deleteIssue, getAllIssues, getSingleIssue, updateIssue } from "./issues.controller";
import auth from "../../middleware/auth";
import { RoleType } from "../../types";
const router = Router();
router.post("/", auth(RoleType.contributor, RoleType.maintainer), createIssue);
router.get("/", getAllIssues);
router.get("/:id", getSingleIssue);
router.patch("/:id", auth(RoleType.contributor, RoleType.maintainer), updateIssue);
router.delete("/:id", auth(RoleType.maintainer), deleteIssue);
export const issuesRoute = router;
//# sourceMappingURL=issues.route.js.map