import express, { Router } from 'express'
import CategoryController from '../../../controller/institute/category/categoryController'
import Middleware from '../../../middleware/middleware'
import asyncErrorHandler from '../../../services/asyncErrorHandler'
const router: Router = express.Router()
router.route('/')
    .post(Middleware.isLoggedIn, asyncErrorHandler(CategoryController.createCategory))
    .get(Middleware.isLoggedIn, asyncErrorHandler(CategoryController.getCategories))
router.route('/:id')
    .delete(Middleware.isLoggedIn, asyncErrorHandler(CategoryController.deleteCategory))

export default router