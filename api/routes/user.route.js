import express  from "express";
import { deleteUser,getOneUser } from "../controllers/user.controller.js";
import {verifyToken} from '../middleware/jwt.js'
const router = express.Router()


router.get('/:profileId',getOneUser)
router.delete('/:id',deleteUser)

export default router