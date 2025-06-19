import { Response } from "express";
import sequelize from "../../../database/connection";
import IExtendedRequest from "../../../middleware/type";

class CourseController {
    static async createCourse(req: IExtendedRequest, res: Response) {
        const { courseName, coursePrice, courseDuration, courseDescription, courseLevel } = req.body
        const instituteNumber = req.user?.currentInstituteNumber

        if (!courseName || !coursePrice || !courseDuration || !courseDescription || !courseLevel) {
            return res.json({
                message: "Please provide all the details off course!"
            })
        }

        const courseThumbnail = null

        await sequelize.query(`INSERT INTO course_${instituteNumber} (courseName, coursePrice, courseDuration, courseThumbnail, courseDescription, courseLevel) VALUES (?,?,?,?,?,?)`, {
            replacements: [courseName, coursePrice, courseDuration, courseThumbnail, courseDescription, courseLevel]
        })

        res.status(200).json({
            message: "Course created successfully!"
        })
    }

    static async deleteCourse(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber

        const courseId = req.params.id
        //first check if course exists or not, if exists only delete.
        const [courseData] = await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id=?`, { replacements: [courseId] })

        if (courseData.length == 0) {
            return res.status(404).json({
                message: "Course deleted successfully!"
            })
        }

        await sequelize.query(`DELETE FROM course_${instituteNumber} WHERE id=?`, {
            replacements: [courseId]
        })
        res.status(200).json({
            message: "Course deleted successfully!"
        })
    }

    static async getAllCourses(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber

        const courseData = await sequelize.query(`SELECT * FROM course_${instituteNumber}`)

        res.status(200).json({
            message: "Course fetched!",
            data: courseData || []
        })

    }

    static async getSingleCourse(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber
        const courseId = req.params.id
        const singleCourse = await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id=?`, {
            replacements: [courseId]
        })

        res.status(200).json({
            message: "Single course fetched successfully!",
            data: singleCourse
        })
    }













}

export default CourseController