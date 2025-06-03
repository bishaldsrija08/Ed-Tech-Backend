//Logical Code goes here

/*

Register --> username, email, password
processing/checking --> valid email, compulsary data
db -->tablee--> query--> CRUD
Login
Logout
Forgot password/OTP
Reset password
*/

import { Request, Response } from 'express'
import User from '../../../database/models/userModel'
//form data => req.body // username, email, password
//files => req.file // files


const registerUser = async (req: Request, res: Response) => {
    // const username = req.body.username
    // const password = req.body.password
    // const email = req.body.email

    //incoming data accept
    const { username, email, password } = req.body //object desturcturing
    if (!username || !email || !password) {
        res.status(400).json({
            message: "Please provide username, password, email!"
        })
    }else{
        //insert into users table
     await User.create({
            username,
            email,
            password
        })

        res.status(200).json({
            message: "Registered Successfully!"
        })

    }

}
export {registerUser}