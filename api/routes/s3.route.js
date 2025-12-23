import express  from "express";
import {uploadToAWS,fetchAllFiles,fetchAllFilesAdmin,uploadToAWSAdmin,uploadToAWSFullIssue,fetchFullIssueFiles,uploadCVToAWS,fetchCVFile} from '../s3upload.js'
import { verifyToken } from "../middleware/jwt.js";
const router = express.Router()

router.get('/:awsId' ,verifyToken,fetchAllFiles);
router.get('/rejection/:awsId/:userId' ,verifyToken,fetchAllFilesAdmin);
router.post('/upload/:awsId',verifyToken,uploadToAWS);
router.post('/rejection/upload/:awsId/:userId',verifyToken,uploadToAWSAdmin);
router.post('/fullIssue/:awsId',verifyToken,uploadToAWSFullIssue);
router.get('/fullIssue/get/:awsId',verifyToken,fetchFullIssueFiles);
router.post('/cv/:userId', uploadCVToAWS);
router.get('/cv/:userId', fetchCVFile);


export default router