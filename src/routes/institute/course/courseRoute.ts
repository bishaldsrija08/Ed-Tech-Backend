import CourseController from "../../../controller/institute/course/courseController"
import Middleware from "../../../middleware/middleware"
import express, { Router } from 'express'
import asyncErrorHandler from "../../../services/asyncErrorHandler"
import upload from "../../../middleware/multerUpload"

// Local Way 
// import { multer, storage } from './../../../middleware/multerMiddleware'
// const upload = multer({ storage: storage })
const router: Router = express.Router()

router.route("/").post(Middleware.isLoggedIn, upload.single('courseThumbnail'), asyncErrorHandler(CourseController.createCourse)).get(Middleware.isLoggedIn, asyncErrorHandler(CourseController.getAllCourses))
router.route("/:id").get(Middleware.isLoggedIn, asyncErrorHandler(CourseController.getSingleCourse))
router.route("/:id").delete(Middleware.isLoggedIn, asyncErrorHandler(CourseController.deleteCourse))

export default router