import express, { Request, Router } from 'express'
import TeacherController from '../../../controller/institute/teacher/teacherController'
import Middleware from '../../../middleware/middleware'
import asyncErrorHandler from '../../../services/asyncErrorHandler'
import upload from '../../../middleware/multerUpload'
const router: Router = express.Router()

// Define your routes here
router.post('/', Middleware.isLoggedIn, upload.single('teacherPhoto'), asyncErrorHandler(TeacherController.createTeacher))

export default router