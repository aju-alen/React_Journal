import express  from "express";
import {verifyToken} from '../middleware/jwt.js'
const router = express.Router()
import {createJournalArticle,getAllJournalArticle} from '../controllers/journalArticle.controller.js'

router.get('/',getAllJournalArticle)
router.post('/create',createJournalArticle)


export default router