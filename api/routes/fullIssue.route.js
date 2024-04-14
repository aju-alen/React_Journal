import express  from "express";
const router = express.Router()
import {createFullIssue,getSingleFullIssue} from '../controllers/fullIssue.controller.js'

router.post('/create',createFullIssue)
router.get('/getIssue',getSingleFullIssue)



export default router