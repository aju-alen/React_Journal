import express  from "express";
import {verifyToken} from '../middleware/jwt.js'
const router = express.Router()
import {createJournalArticle,getAllJournalArticle,getAllArticlesToVerify,postRejectionText,getSingleArticle,updateJournalArticle,acceptManuscript,getPublsihedJournalArticle, getSinglePublishedArticle,deleteArticle,downloadCertificate,getAllPublsihedJournalArticle,getViewerSignedUrl,getOpenAccessViewerSignedUrl,getOpenAccessDownloadSignedUrl,getOpenAccessFileStream,getViewerFileStream,updateArticleAccessModel,getArticlesForReviewer,reviewerAcceptArticle} from '../controllers/journalArticle.controller.js'

router.post('/generate', downloadCertificate);
router.get('/',getAllJournalArticle)
router.post('/create',createJournalArticle)
router.get('/publishedArticle',getAllPublsihedJournalArticle)
router.get('/publishedArticle/:catId',getPublsihedJournalArticle)
router.post('/updateArticle/:articleId',updateJournalArticle)
router.get('/singleArticle/:articleId',getSingleArticle)
router.get('/singlePublishedArticle/:articleId',getSinglePublishedArticle)
router.get('/open-access/viewer/:articleId',getOpenAccessViewerSignedUrl)
router.get('/open-access/download/:articleId',getOpenAccessDownloadSignedUrl)
router.get('/open-access/file/:articleId',getOpenAccessFileStream)
router.get('/get-viewer-url/:articleId',verifyToken,getViewerSignedUrl)
router.get('/get-viewer-file/:articleId',verifyToken,getViewerFileStream)
router.put('/access-model/:articleId',verifyToken,updateArticleAccessModel)
router.get('/verifyArticles/:profileId',verifyToken,getAllArticlesToVerify)
router.post('/verifyArticles/sendRejectionText',verifyToken,postRejectionText)
router.put('/verifyArticles/acceptManuscript',verifyToken,acceptManuscript)
router.delete(`/delete-article/:articleId/:userId`,verifyToken,deleteArticle)
router.get('/reviewer/articles',verifyToken,getArticlesForReviewer)
router.post('/reviewer/accept/:articleId',verifyToken,reviewerAcceptArticle)


export default router