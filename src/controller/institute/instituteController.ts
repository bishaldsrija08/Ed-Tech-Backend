import { NextFunction, Response } from "express";
import sequelize from "../../database/connection";
import generateRandomInstituteNumber from "../../services/generateRandomInstituteNumber";
import IExtendedRequest from "../../middleware/type";
import User from "../../database/models/userModel";

class InstituteController {
    static async createInstitute(req: IExtendedRequest, res: Response, next: NextFunction) {
        // console.log("middleware bata ako", req.user)
        const { instituteName, instituteEmail, institutePhoneNumber, instituteAddress } = req.body

        //vat wa pan na aye null set garne
        const instituteVatNumber = req.body.instituteVatNumber || null
        const institutePanNumber = req.body.institutePanNumber || null

        if (!instituteVatNumber || !institutePanNumber || !instituteName || !instituteEmail || !institutePhoneNumber || !instituteAddress) {
            res.status(400).json({
                message: "Please provide Institute name, Institute email, Institute phone number, Institute address"
            })
            return

        }
        //ayo vane institute create garnu paryo ->institute_12, course_12

        const instituteNumber = generateRandomInstituteNumber()

        await sequelize.query(`CREATE TABLE IF NOT EXISTS institute_${instituteNumber} (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    instituteName VARCHAR(255) NOT NULL,
    instituteEmail VARCHAR(255) NOT NULL UNIQUE,
    institutePhoneNumber VARCHAR(255) NOT NULL,
    instituteAddress VARCHAR(255) NOT NULL,
    instituteVatNumber VARCHAR(255),
    institutePanNumber VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`)

        await sequelize.query(`INSERT INTO institute_${instituteNumber}(instituteName, instituteEmail, institutePhoneNumber, instituteAddress, instituteVatNumber, institutePanNumber) VALUES(?,?,?,?,?,?)`, {
            replacements: [instituteName, instituteEmail, institutePhoneNumber, instituteAddress, instituteVatNumber, institutePanNumber]
        })

        // to create user_institute history table jaha chai users le k k institute haru create garyo sabai ko number basnu paryo 
        await sequelize.query(`CREATE TABLE IF NOT EXISTS user_institute(
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
            userId VARCHAR(255) REFERENCES users(id), 
            instituteNumber INT UNIQUE 
            )`)

        if (req.user) {
            await sequelize.query(`INSERT INTO user_institute(userId,instituteNumber) VALUES(?,?)`, {
                replacements: [req.user.id, instituteNumber]
            })

            await User.update({
                currentInstituteNumber: instituteNumber,
                role: "institute"
            }, {
                where: {
                    id: req.user.id
                }
            })
            req.instituteNumber = instituteNumber
            next()
        }
    }

    static async createTeacherTable(req: IExtendedRequest, res: Response, next: NextFunction) {
        const { instituteNumber } = req
        console.log(instituteNumber, "Hello hi how are y0ou?")
        await sequelize.query(`CREATE TABLE teacher_${instituteNumber}(
                    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
                    teacherName VARCHAR(255) NOT NULL, 
                    teacherEmail VARCHAR(255) NOT NULL UNIQUE, 
                    teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE
                    )`)
        next()

    }

    static async createStudentTable(req: IExtendedRequest, res: Response, next: NextFunction) {
        const { instituteNumber } = req
        await sequelize.query(`CREATE TABLE IF NOT EXISTS student_${instituteNumber}(
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
        studentName VARCHAR(255) NOT NULL, 
        studentPhoneNo VARCHAR(255) NOT NULL UNIQUE
        )`)
        next()
    }

    static async createCourseTable(req: IExtendedRequest, res: Response, next: NextFunction) {
        const instituteNumber = req.instituteNumber
        console.log(instituteNumber, "yo number ho")
        await sequelize.query(`CREATE TABLE IF NOT EXISTS course_${instituteNumber}(
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        courseName VARCHAR(255) NOT NULL UNIQUE, 
        coursePrice VARCHAR(255) NOT NULL
        )`)

        res.status(200).json({
            message: "Institute created vayoo!!!",
            instituteNumber,
        })
    }

}
export default InstituteController