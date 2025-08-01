import { Response } from "express";
import IExtendedRequest from "../../../middleware/type";
import sequelize from "../../../database/connection";


class StudentController{

static async getStudents(req:IExtendedRequest, res: Response){
    const instituteNumber = req.user?.currentInstituteNumber
    const students = await sequelize.query(`SELECT * FROM stiudent_${instituteNumber}`)
    res.status(200).json({
        message: "Students fetched!",
        data: students
    })
}















}

export default StudentController