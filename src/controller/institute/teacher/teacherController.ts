import { Response } from "express";
import IExtendedRequest from "../../../middleware/type";
import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";
import generateRandomPassword from "../../../services/generateRandomPassword";
import sendMail from "../../../services/sendMail";

class TeacherController {
    static async createTeacher(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber;
        //Accept teacher data
        const teacherPhoto = req.file ? req.file.path : "https://www.zuckermanlaw.com/wp-content/uploads/whistleblowing/anonymous-sec-whistleblower.jpg";
        const { teacherName, teacherEmail, teacherPhoneNumber, teacherExpertise, teacherSalary, teacherJoinDate, courseId } = req.body
        if (!teacherName || !teacherEmail || !teacherPhoneNumber || !teacherExpertise || !teacherSalary || !teacherJoinDate) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        //password generate function
        const data = generateRandomPassword(teacherName);

        await sequelize.query(`INSERT INTO teacher_${instituteNumber}(teacherName, teacherEmail, teacherPhoneNumber, teacherExpertise, salary, joinDate, teacherPhoto, teacherPassword) VALUES(?,?,?,?,?,?,?,?)`, {
            type: QueryTypes.INSERT,
            replacements: [teacherName, teacherEmail, teacherPhoneNumber, teacherExpertise, teacherSalary, teacherJoinDate, teacherPhoto, data.hashedVersion]
        });

        const teacherData: { id: string }[] = await sequelize.query(`SELECT id FROM teacher_${instituteNumber} WHERE teacherEmail=?`, {
            type: QueryTypes.SELECT,
            replacements: [teacherEmail]
        })

        await sequelize.query(`UPDATE course_${instituteNumber} SET teacherId=? WHERE id=?`, {
            type: QueryTypes.UPDATE,
            replacements: [teacherData[0].id, courseId]
        })

        // send mail function goes here 
        const mailInformation = {
            to: teacherEmail,
            subject: "Welcome to our Platform.",
            text: `Welcome xa hai, <b>Email</b> : ${teacherEmail}, Password : ${data.plainVersion}, your institute number is : ${instituteNumber}`
        }
        await sendMail(mailInformation)

        res.status(200).json({
            message: "teacher created successfully"
        })

    }

    static async getTeachers(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber;
        const teachers = await sequelize.query(`SELECT * FROM teacher_${instituteNumber}`, {
            type: QueryTypes.SELECT
        })
        res.status(200).json({
            message: "teachers fetched",
            data: teachers
        })
    }

    static async deleteTeacher(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber;
        const { teacherId } = req.params;

        await sequelize.query(`DELETE FROM teacher_${instituteNumber} WHERE id=?`, {
            type: QueryTypes.DELETE,
            replacements: [teacherId]
        })

        res.status(200).json({
            message: "teacher deleted successfully"
        })
    }

}

export default TeacherController;