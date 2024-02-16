import express  from "express";
import { getOneUser,getUserWithArticles } from "../controllers/user.controller.js";
import {verifyToken} from '../middleware/jwt.js'
const router = express.Router()


router.get('/:profileId',getOneUser)
router.get('myArticles/:profileId',getUserWithArticles)

export default router