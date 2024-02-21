import express  from "express";
import {uploadToAWS,fetchAllFiles} from '../s3upload.js'
import { verifyToken } from "../middleware/jwt.js";
const router = express.Router()

router.get('/' ,verifyToken,fetchAllFiles);
router.post('/upload',verifyToken,uploadToAWS);


export default router