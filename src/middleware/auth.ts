import type { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "../types/index";

const auth = ( ...roles: UserRole[] ) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {

            const token = req.headers.authorization;

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized Access!"
                });
            }

            // 2. Verify token 
            const decoded = jwt.verify(
                token,
                config.jwtSecretKey
            ) as JwtPayload;

            const userData = await pool.query(
                `SELECT * FROM users WHERE id = $1`,
                [decoded.id]
            );

            // If user not found in DB
            if (userData.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found!"
                });
            }

            const user = userData.rows[0];

            if(roles.length && !roles.includes(user.role)){
                return res.status(404).json({
                    success: false,
                    message: "User not authorized!"
                });
            }

            req.user = decoded;
            next();

        } catch (error: unknown) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
        error
      });
        }
    };
};

export default auth;