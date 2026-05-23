import type { JwtPayload } from "jsonwebtoken";
import { pool } from "../../db";
import type { CreateIssue, GetAllIssues } from "./issues.interface";

const createIssueDB = async (payload: CreateIssue, reporter_id: number) => {

    const {title, description, type } = payload;
    
    const user = await pool.query(`
        SELECT * FROM users WHERE id = $1
        ` , [reporter_id]);
        
        if (user.rows.length === 0){
            throw new Error("User not found.");
        }
        const result = await pool.query(`
            INSERT INTO issues (reporter_id, title, description, type ) VALUES ($1, $2, $3, $4) RETURNING *
        `, [reporter_id, title, description, type]);

        return result
}


const getAllIssuesDB = async (query: GetAllIssues) => {

  const { sort, type, status } = query;

  const allowedSort = ["newest", "oldest"];
  const allowedType = ["bug", "feature_request"];
  const allowedStatus = ["open", "in_progress", "resolved"];    

  if (sort &&!allowedSort.includes(sort)) {
    throw new Error("Invalid sort value");
  }

    if (type && !allowedType.includes(type)) {
    throw new Error("Invalid type value");
  }

if (status && !allowedStatus.includes(status)) {
    throw new Error("Invalid status value");
  }

  let sql = `SELECT * FROM issues WHERE 1=1`;

  //  TYPE
  if (type) {
    sql += ` AND type = '${type}'`;
  }

  //  STATUS
  if (status) {
    sql += ` AND status = '${status}'`;
  }

  // SORTING
  if (sort === "oldest") {
    sql += ` ORDER BY created_at ASC`;
  } else {
    sql += ` ORDER BY created_at DESC`;
  }

  const issuesResult = await pool.query(sql);

  const finalIssues = [];

  // GET REPORTER INFO
  for (const issue of issuesResult.rows) {

    const reporterResult = await pool.query(
      `SELECT id, name, role FROM users WHERE id = $1`,
      [issue.reporter_id]
    );

    const reporter = reporterResult.rows[0];

    finalIssues.push({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter,
      created_at: issue.created_at,
      updated_at: issue.updated_at
    });
  }

  return finalIssues;
};


const getSingleIssueDB = async (id: number) => {
    const result = await pool.query(`
        SELECT * FROM issues WHERE id = $1
        ` , [id]);
        
        if (result.rows.length === 0){
            throw new Error("Issue not found.");
        }
        const issue = result.rows[0];

        
        // GET REPORTER 
        const reporterResult = await pool.query(
            `SELECT id, name, role FROM users WHERE id = $1`,
            [issue.reporter_id]
        );

        const reporter = reporterResult.rows[0];

        const response = {
            id: issue.id,
            title: issue.title,
            description: issue.description,
            type: issue.type,
            status: issue.status,
            reporter,
            created_at: issue.created_at,
            updated_at: issue.updated_at
        };
        return response;
};        


const updateIssueDB = async (id: number, payload: CreateIssue, user: JwtPayload) => {
        const issueResult = await pool.query(
            `SELECT * FROM issues WHERE id = $1`,
            [id]
        );

        if (issueResult.rows.length === 0) {
            throw new Error("Issue not found.");
        }

        const issue = issueResult.rows[0];

        const userResult = await pool.query(
      `SELECT id, role FROM users WHERE id = $1`,
      [user.id]
      );

      const currentUser = userResult.rows[0];

        //  PERMISSION CHECK
        if (currentUser.role === "contributor") {

            if (issue.reporter_id !== currentUser.id) {
            throw new Error("You can only update your own issue");
            }

            if (issue.status !== "open") {
            throw new Error("You can only update open issues");
            }
        }

        const result = await pool.query(`
            UPDATE issues SET title =COALESCE($1, title), description = COALESCE($2, description), type = COALESCE($3, type), updated_at = NOW() WHERE id = $4
        `, [payload.title, payload.description, payload.type, id]);

        return result;
}

const deleteIssueDB = async (id: number) => {
    const issue = await pool.query(`
        SELECT * FROM issues WHERE id = $1
    `, [id]);

    if(issue.rows.length === 0){
        throw new Error("Issue not found.");
    }

    const result = await pool.query(`
        DELETE FROM issues WHERE id = $1
    `, [id]);

    return result;
}

export const issuesService = {
    createIssueDB, getAllIssuesDB, getSingleIssueDB, updateIssueDB, deleteIssueDB
}