import type { JwtPayload } from "jsonwebtoken";
import type { CreateIssue, GetAllIssues } from "./issues.interface";
export declare const issuesService: {
    createIssueDB: (payload: CreateIssue, reporter_id: number) => Promise<import("pg").QueryResult<any>>;
    getAllIssuesDB: (query: GetAllIssues) => Promise<{
        id: any;
        title: any;
        description: any;
        type: any;
        status: any;
        reporter: any;
        created_at: any;
        updated_at: any;
    }[]>;
    getSingleIssueDB: (id: number) => Promise<{
        id: any;
        title: any;
        description: any;
        type: any;
        status: any;
        reporter: any;
        created_at: any;
        updated_at: any;
    }>;
    updateIssueDB: (id: number, payload: CreateIssue, user: JwtPayload) => Promise<import("pg").QueryResult<any>>;
    deleteIssueDB: (id: number) => Promise<import("pg").QueryResult<any>>;
};
//# sourceMappingURL=issues.service.d.ts.map