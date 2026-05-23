import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";

export const signUp = async (req: Request, res: Response) => {
  try {
    const result = await authService.signUpUserDB(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: unknown) {
    let message = "Signup failed";

    if (error instanceof Error) {
      message = error.message;
    }
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message,
      error: error,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserDB(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: unknown) {
    let message = "Login failed";

    if (error instanceof Error) {
      message = error.message;
    }
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message,
      error: error,
    });
  }
};
