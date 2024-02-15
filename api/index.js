import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middleware/errorHandler.js'
import cors from 'cors'
import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import journalRoute from './routes/journal.route.js'
import journalArticleRoute from './routes/journalArticle.route.js'

const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authRoute)
app.use('/api/users',userRoute)
app.use('/api/journal',journalRoute)
app.use('/api/journal',journalArticleRoute)

app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{

    console.log(`server listening at port ${PORT}`);
})
