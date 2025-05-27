import express  from "express";
import {  returnSessionStatus, createCheckoutSessionForSubscription, createPortalSessionForSubscription} from "../controllers/stripe.controller.js";
const router = express.Router()
//---publish article checkout
// router.post('/create-checkout-session',createCheckoutSession)
router.get('/session-status',returnSessionStatus)


router.post('/create-checkout-sessions',createCheckoutSessionForSubscription)
router.post('/create-portal-session',createPortalSessionForSubscription)

export default router