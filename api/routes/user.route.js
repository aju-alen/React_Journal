import express  from "express";
import { getOneUser,getUserWithArticles,editUserDetails} from "../controllers/user.controller.js";
import {verifyToken} from '../middleware/jwt.js'
const router = express.Router()


router.get('/:profileId',getOneUser)
router.get('myArticles/:profileId',getUserWithArticles)
router.post('/edit/:profileId',editUserDetails)

export default router