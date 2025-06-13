import { Request, Response } from "express";
import sequelize from "../../database/connection";
import generateRandomInstituteNumber from "../../services/generateRandomInstituteNumber";
class InstituteController {
    static async createInstitute(req: Request, res: Response) {
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

        await sequelize.query(`CREATE TABLE teacher_${instituteNumber}(
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
            teacherName VARCHAR(255) NOT NULL, 
            teacherEmail VARCHAR(255) NOT NULL UNIQUE, 
            teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE
            )`)

        res.status(200).json({
            message: "Created successfully"
        })
    }
}

export default InstituteController