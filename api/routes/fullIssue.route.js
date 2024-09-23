import express  from "express";
const router = express.Router()
import {createFullIssue,getSingleFullIssue,findIssue} from '../controllers/fullIssue.controller.js'

router.post('/create',createFullIssue)
router.get('/getIssue',getSingleFullIssue)
router.get('/find-issue/:volume/:issue',findIssue)



export default router