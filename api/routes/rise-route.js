import express from "express";
const router = express.Router()
import {sendContact,createCheckoutSession,submitProfileRequest,submitReportRequest,submitInvestorRequest,verifyOTP} from '../controllers/rise-controller.js';


router.post('/send-contact',sendContact);
router.post('/create-checkout-session',createCheckoutSession);
router.post('/submit-profile-request',submitProfileRequest);
router.post('/submit-report-request',submitReportRequest);
router.post('/submit-investor-request',submitInvestorRequest);
router.post('/verify-otp',verifyOTP);


export default router;