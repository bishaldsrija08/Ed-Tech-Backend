import express from 'express'
import authRoute from './routes/globals/auth/authRroute'
import instititeRoute from './routes/institute/instituteRoute'
const app = express()
//incoming ma json pani auna sakxa, json pani buj vaneko
app.use(express.json())

app.use("/api", authRoute)
app.use("/api/institute", instititeRoute)


export default app