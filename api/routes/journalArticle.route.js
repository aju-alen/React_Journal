import express  from "express";
import {verifyToken} from '../middleware/jwt.js'
const router = express.Router()
import {createJournalArticle,getAllJournalArticle,getAllArticlesToVerify,postRejectionText,getSingleArticle,updateJournalArticle,acceptManuscript,getPublsihedJournalArticle, getSinglePublishedArticle,deleteArticle,downloadCertificate} from '../controllers/journalArticle.controller.js'

router.post('/generate', downloadCertificate);
router.get('/',getAllJournalArticle)
router.post('/create',createJournalArticle)
router.get('/publishedArticle/:catId',getPublsihedJournalArticle)
router.post('/updateArticle/:articleId',updateJournalArticle)
router.get('/singleArticle/:articleId',getSingleArticle)
router.get('/singlePublishedArticle/:articleId',getSinglePublishedArticle)
router.get('/verifyArticles/:profileId',verifyToken,getAllArticlesToVerify)
router.post('/verifyArticles/sendRejectionText',verifyToken,postRejectionText)
router.put('/verifyArticles/acceptManuscript',verifyToken,acceptManuscript)
router.delete(`/delete-article/:articleId/:userId`,verifyToken,deleteArticle)


export default router