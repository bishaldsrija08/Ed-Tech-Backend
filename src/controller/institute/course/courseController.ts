import { Response } from "express";
import sequelize from "../../../database/connection";
import IExtendedRequest from "../../../middleware/type";
import { QueryTypes } from "sequelize";

class CourseController {
    static async createCourse(req: IExtendedRequest, res: Response) {
        const { courseName, coursePrice, courseDuration, courseDescription, courseLevel, categoryId } = req.body
        const instituteNumber = req.user?.currentInstituteNumber
        const courseThumbnail = req.file?.path

        if (!courseName || !coursePrice || !courseDuration || !courseDescription || !courseLevel || !courseThumbnail || !categoryId) {
            return res.status(404).json({
                message: "Please provide all the details off course!"
            })
        }

        await sequelize.query(`INSERT INTO course_${instituteNumber} (courseName, coursePrice, courseDuration, courseThumbnail, courseDescription, courseLevel, categoryId) VALUES (?,?,?,?,?,?,?)`, {
            replacements: [courseName, coursePrice, courseDuration, courseThumbnail, courseDescription, courseLevel, categoryId],
            type: QueryTypes.INSERT
        })

        res.status(200).json({
            message: "Course created successfully!"
        })
    }

    static async deleteCourse(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber

        const { id } = req.params
        //first check if course exists or not, if exists only delete.
        const courseData = await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id=?`, { replacements: [id], type: QueryTypes.SELECT })

        if (courseData.length == 0) {
            return res.status(404).json({
                message: "Course deleted successfully!"
            })
        }

        await sequelize.query(`DELETE FROM course_${instituteNumber} WHERE id=?`, {
            replacements: [id],
            type: QueryTypes.DELETE
        })
        res.status(200).json({
            message: "Course deleted successfully!"
        })
    }

    static async getAllCourses(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber
        console.log(instituteNumber)
        const [courseData] = await sequelize.query(`SELECT * FROM course_${instituteNumber} JOIN category_${instituteNumber} ON course_${instituteNumber}.categoryId = category_${instituteNumber}.id`, {
            type: QueryTypes.SELECT
        })
        console.log(courseData)

        res.status(200).json({
            message: "Course fetched!",
            data: courseData || []
        })

    }

    static async getSingleCourse(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber
        const courseId = req.params.id
        const singleCourse = await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id=?`, {
            replacements: [courseId],
            type: QueryTypes.SELECT
        })

        res.status(200).json({
            message: "Single course fetched successfully!",
            data: singleCourse
        })
    }










}

export default CourseController