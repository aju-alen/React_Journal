import express from "express";
const router = express.Router()
import {sendContact,createCheckoutSession} from '../controllers/rise-controller.js';


router.post('/send-contact',sendContact);
router.post('/create-checkout-session',createCheckoutSession);


export default router;