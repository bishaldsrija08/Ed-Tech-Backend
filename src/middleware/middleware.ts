import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import User from "../database/models/userModel";
import IExtendedRequest from "./type";
class Middleware {

    static isLoggedIn(req: IExtendedRequest, res: Response, next: NextFunction) {
        //check if login or not
        //token accept
        const token = req.headers.authorization
        if (!token) {
            res.status(400).json({
                message: "Please provide token"
            })
            return
        }
        //token verify garne
        jwt.verify(token, "secredKey", async (error, success: any) => {
            if (error) {
                res.status(403).json({
                    message: "Inavlid token, Please login to create institute."
                })
            } else {
                console.log("login vayo", success)
                const userData = await User.findByPk(success.id)
                // findbypk returns object

                //findAll returns array
                // const userData = await User.findAll({
                //     where: {
                //         id: success.id
                //     }
                // })
                if (!userData) {
                    res.status(403).json({
                        message: "No user with that id, invalid token."
                    })
                } else {
                    req.user = userData
                    // console.log(userData, "naya request gareko")
                    next()
                }
            }
        })
    }
}

export default Middleware