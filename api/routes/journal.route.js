import express  from "express";
import {verifyToken} from '../middleware/jwt.js'
const router = express.Router()
import {createJournal,getAllJournal,getAllJournalCategoryName,getSingleJournal} from '../controllers/journal.controller.js'



router.get('/',getAllJournal)
router.get('/categories',verifyToken,getAllJournalCategoryName)
router.post('/create',createJournal)
router.get('/:catId',getSingleJournal)


export default router