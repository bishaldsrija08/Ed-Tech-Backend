/*

REGISTER/SIGNUP
incoming data  --> username, email, password 
processing/checking --> email valid, compulsory data aaaunu paryo 
db--> table--> query --> table ma insert/read/delete/update

LOGIN/SIGNIN
LOGOUT
FORGOT PASSWORD 
RESET PASSWORD/ OTP

*/

import { Request, Response } from "express";
import User from "../../../database/models/userModel";
import bcrypt from "bcrypt";
import generateJWTToken from "../../../services/generateJWTToken";

// json data --> req.body // username,email,password
// files --> req.file // files
// const registerUser = async (req:Request,res:Response)=>{
// //    const username = req.body.username
// //    const password = req.body.password
// //    const email = req.body.email
//     // incoming data --> accept
//    const {username,password,email} = req.body
//    if(!username || !password || !email){
//      res.status(400).json({
//         message : "Please provide username, password, email"
//     })
//     return
//    }
//     // insert into Users table
//     await User.create({
//         username :username,
//         password : password,
//         email : email
//     })
//     res.status(200).json({
//         message : "User registered successfully"
//     })

// } // function
// BOLA Attack

class AuthController {
    static async registerUser(req: Request, res: Response) {
        if (req.body == undefined) {
            res.status(400).json({
                message: "No data was sent!!",
            });
            return;
        }
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            res.status(400).json({
                message: "Please provide username, password, email",
            });
            return;
        }
        //    const [data] =  await User.findAll({
        //         where : {
        //             email
        //         }
        //     })
        //     if(data){
        //         // already exists with that email
        //     }
        // insert into Users table
        await User.create({
            username: username,
            password: bcrypt.hashSync(password, 12),
            email: email,
        });
        res.status(201).json({
            message: "User registered successfully",
        });
    }

    //login user

    /*
  Login flow
  email/username, password (basics)
  email, password -> data accept -> validation
      */
    static async loginUser(req: Request, res: Response) {
        if (req.body == undefined) {
            res.status(400).json({
                message: "No data was sent!!",
            });
            return;
        }

        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                message: "Please provide email or password!",
            });
        }

        //check email exist on table or not
        const [data] = await User.findAll({ //findAll returns array
            where: {
                email
            },
        });

        if (data) {
            //check password
            const isMatched = bcrypt.compareSync(password, data.password);

            if (isMatched) {
                //generate token
                const token = generateJWTToken({
                    id: data.id
                });
                res.status(200).json({
                    token,
                    message: "Logged in Successfully!"
                });
            } else {
                res.status(403).json({
                    message: "Invalid email or password!",
                });
            }
        } else {
            res.status(403).json({
                message: "Creadentials didn't matched!",
            });
        }
    }
}

export default AuthController;