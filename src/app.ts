import express from 'express'
import authRoute from './routes/globals/auth/authRroute'
const app = express()
//incoming ma json pani auna sakxa, json pani buj vaneko
app.use(express.json())

app.use("/api", authRoute)



export default app