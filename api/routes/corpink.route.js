import express from "express";
import { requestService, sendOtp, verifyOtp } from '../controllers/corpink.controller.js';

const router = express.Router();

router.post('/request-service', requestService);
router.post('/otp', sendOtp);
router.post('/otp/verify', verifyOtp);

export { router as corpInkRoutes };
