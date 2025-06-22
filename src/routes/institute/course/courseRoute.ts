import CourseController from "../../../controller/institute/course/courseController"
import Middleware from "../../../middleware/middleware"
import express, { Request, Router } from 'express'
import asyncErrorHandler from "../../../services/asyncErrorHandler"
import multer from "multer"
import storage from "../../../services/cloudinaryConfig"

const upload = multer({storage : storage,
    fileFilter : (req:Request,file:Express.Multer.File,cb)=>{
        const allowedFileTypes = ['image/png','image/jpeg','image/jpg']
        if(allowedFileTypes.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(new Error("Only image support garxaa hai!!!"))
        }
    }, 
    limits : {
        fileSize : 4 * 1024 * 1024 // 2 mb
    }
})

// Local Way 
// import { multer, storage } from './../../../middleware/multerMiddleware'
// const upload = multer({ storage: storage })
const router: Router = express.Router()

router.route("/").post(Middleware.isLoggedIn, upload.single('courseThumbnail'), asyncErrorHandler(CourseController.createCourse)).get(CourseController.getAllCourses)
router.route("/:id").get(CourseController.getSingleCourse)
router.route("/:id").delete(Middleware.isLoggedIn, asyncErrorHandler(CourseController.deleteCourse))

export default router