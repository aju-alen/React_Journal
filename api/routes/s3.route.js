import express  from "express";
import {uploadToAWS,fetchAllFiles} from '../s3upload.js'
import { verifyToken } from "../middleware/jwt.js";
const router = express.Router()

router.get('/:awsId' ,verifyToken,fetchAllFiles);
router.post('/upload/:awsId',verifyToken,uploadToAWS);


export default router