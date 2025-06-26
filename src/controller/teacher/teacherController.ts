

import { Request, Response } from "express";
import { QueryTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import sequelize from "../../database/connection";
import generateJWTToken from "../../services/generateJWTToken";

interface ITeacherData {
    teacherPassword: string,
    id: string
}



class TeacherController {
    // Teacher login implementation
    static async teacherLogin(req: Request, res: Response) {
        const { teacherEmail, teacherPassword, teacherInstituteNumber } = req.body;
        const teacherData: ITeacherData[] = await sequelize.query(`SELECT * FROM teacher_${teacherInstituteNumber} WHERE teacherEmail=?`, {
            type: QueryTypes.SELECT,
            replacements: [teacherEmail]
        });

        if (teacherData.length === 0) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        //check password
        const isPasswordValid = await bcrypt.compare(teacherPassword, teacherData[0].teacherPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        //token generation
        const token = generateJWTToken({
            id: teacherData[0].id,
            instituteNumber: teacherInstituteNumber
        });
        res.status(200).json({
            message: "Login successful",
            token
        });
    }

}

export default TeacherController;