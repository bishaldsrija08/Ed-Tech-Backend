import { Response } from "express";
import IExtendedRequest from "../../../middleware/type";
import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";
import generateRandomPassword from "../../../services/generateRandomPassword";

class TeacherController {
    static async createTeacher(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber;
        //Accept teacher data
        const teacherPhoto = req.file ? req.file.path : "https://www.zuckermanlaw.com/wp-content/uploads/whistleblowing/anonymous-sec-whistleblower.jpg";
        const { teacherName, teacherEmail, teacherPhoneNumber, teacherExpertise, teacherSalary, teacherJoinDate } = req.body
        if (!teacherName || !teacherEmail || !teacherPhoneNumber || !teacherExpertise || !teacherSalary || !teacherJoinDate) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        //password generate function
        const data = generateRandomPassword(teacherName);

        await sequelize.query(`INSERT INTO teacher_${instituteNumber}(teacherName, teacherEmail, teacherPhoneNumber, teacherExpertise, salary, joinDate, teacherPhoto, teacherPassword) VALUES(?,?,?,?,?,?,?,?)`, {
            type: QueryTypes.INSERT,
            replacements: [teacherName, teacherEmail, teacherPhoneNumber, teacherExpertise, teacherSalary, teacherJoinDate, teacherPhoto, data.hashedVersion]
        });

        //send mail


        res.status(200).json({
            message: "teacher created"
        })

    }






}

export default TeacherController;