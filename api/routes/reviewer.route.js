import express from "express";
import { getAllReviewers, approveReviewer, rejectReviewer } from "../controllers/reviewer.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router()

router.get('/all', verifyToken, getAllReviewers);
router.post('/approve/:userId', verifyToken, approveReviewer);
router.post('/reject/:userId', verifyToken, rejectReviewer);

export default router

