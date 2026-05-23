import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { issuesService } from "./issues.service";

export const createIssue = async (req: Request, res: Response) => {
  try {
    const reporter_id = req.user.id;
    const result = await issuesService.createIssueDB(req.body, reporter_id);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result.rows[0],
    });
  } catch (error: unknown) {
    let message = "Issue creation failed";
    if (error instanceof Error) {
      message = error.message;
    }
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message,
      error: error,
    });
  }
};

export const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issuesService.getAllIssuesDB(req.query);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrived successfully",
      data: result,
    });
  } catch (error: unknown) {
    let message = "Issue fetching failed";
    if (error instanceof Error) {
      message = error.message;
    }
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message,
      error: error,
    });
  }
};


export const getSingleIssue = async (req: Request, res: Response) => {
    try {
        const {id} = req.params

        const result = await issuesService.getSingleIssueDB(Number(id));
        sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Issues retrived successfully",
        data: result,            
        })
    } catch (error: unknown) {
    let message = "Issue fetching failed";
    if (error instanceof Error) {
      message = error.message;
    }
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message,
      error: error,
    });    
    }
}


export const updateIssue = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const user = req.user;
        const result = await issuesService.updateIssueDB(Number(id), req.body, user);
        sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Issue updated successfully",
        data: result.rows[0],
        })
    } catch (error: unknown) {
    let message = "Issue update failed";
    if (error instanceof Error) {
      message = error.message;
    }
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message,
      error: error,
    });    
    }
}

export const deleteIssue = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const result = await issuesService.deleteIssueDB(Number(id));
        sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Issue deleted successfully",
        data: result.rows[0],
        })
    } catch (error: unknown) {
    let message = "Issue delete failed";
    if (error instanceof Error) {
      message = error.message;
    }
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message,
      error: error,
    }); 
    }
}