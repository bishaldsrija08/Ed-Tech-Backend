import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../database/models/userModel";
import IExtendedRequest from "./type";

class Middleware {

    static isLoggedIn(req: IExtendedRequest, res: Response, next: NextFunction) {
        const token = req.headers.authorization;

        if (!token) {
            res.status(400).json({
                message: "Please provide token"
            });
            return;
        }

        jwt.verify(token, process.env.JWT_SECRET as string, async (error, success: any) => {
            if (error) {
                console.error("JWT verification error:", error);
                res.status(403).json({
                    message: "Invalid token, please login to create institute."
                });
            } else {
                try {
                    const userData = await User.findByPk(success.data.id, {
                        attributes: ['id', 'currentInstituteNumber']
                    })

                    if (!userData) {
                        res.status(403).json({
                            message: "No user with that ID, invalid token."
                        });
                    } else {
                        req.user = userData;
                        next();
                    }
                } catch (err) {
                    console.error("Database error:", err);
                    res.status(500).json({
                        message: "Internal server error"
                    });
                }
            }
        });
    }
}

export default Middleware;