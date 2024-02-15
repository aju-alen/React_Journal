import express  from "express";
import {verifyToken} from '../middleware/jwt.js'
const router = express.Router()
import {createJournal,getAllJournal} from '../controllers/journal.controller.js'


router.get('/',getAllJournal)
router.post('/create',createJournal)


export default router