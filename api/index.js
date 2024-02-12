import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middleware/errorHandler.js'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'

const prisma = new PrismaClient();
const app = express()
dotenv.config()

app.use(cors({credentials:true}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authRoute)
app.use('/api/users',userRoute)

app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{

    console.log(`server listening at port ${PORT}`);
})
