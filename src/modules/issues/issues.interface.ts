export interface CreateIssue {
    title: string;
    description: string;
    type: string;
}

export interface GetAllIssues {
  sort?: string;
  type?: string;
  status?: string;
}
