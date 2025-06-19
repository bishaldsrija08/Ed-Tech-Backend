import CourseController from "../../../controller/institute/course/courseController"
import Middleware from "../../../middleware/middleware"
import express, { Router } from 'express'
import asyncErrorHandler from "../../../services/asyncErrorHandler"
const router: Router = express.Router()


router.route("/").post(Middleware.isLoggedIn, asyncErrorHandler(CourseController.createCourse)).get(CourseController.getAllCourses)
router.route("/:id").get(CourseController.getSingleCourse)
router.route("/:id").delete(Middleware.isLoggedIn, asyncErrorHandler(CourseController.deleteCourse))

export default router