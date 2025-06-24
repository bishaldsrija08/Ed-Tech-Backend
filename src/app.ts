import express from 'express'
import authRoute from './routes/globals/auth/authRroute'
import instititeRoute from './routes/institute/instituteRoute'
import courseRoute from './routes/institute/course/courseRoute'
import studentRoute from './routes/institute/student/studentRoute'
import categoryRoute from './routes/institute/category/categoryRoutes'
import teacherRoute from './routes/institute/teacher/teacherRoutes'
const app = express()
//incoming ma json pani auna sakxa, json pani buj vaneko
app.use(express.json()); // for JSON
app.use(express.urlencoded({ extended: true })); // for form data

app.use("/api", authRoute)
app.use("/api/institute", instititeRoute)
app.use("/api/institute/course", courseRoute)
app.use("/api/institute/student", studentRoute)
app.use("/api/institute/category", categoryRoute)
app.use("/api/institute/teacher", teacherRoute)


export default app