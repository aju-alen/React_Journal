import express  from "express";
import {verifyToken} from '../middleware/jwt.js'
const router = express.Router()
import {createJournal,getAllJournal,getAllJournalCategoryName} from '../controllers/journal.controller.js'


router.get('/',getAllJournal)
router.get('/categories',getAllJournalCategoryName)
router.post('/create',createJournal)


export default router