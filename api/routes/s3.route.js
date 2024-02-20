import express  from "express";
import {uploadToAWS,fetchAllFiles} from '../s3upload.js'
const router = express.Router()

router.post('/upload' ,uploadToAWS);
router.get('/' ,fetchAllFiles);


export default router