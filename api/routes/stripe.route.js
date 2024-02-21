import express  from "express";
import { createCheckoutSession} from "../controllers/stripe.controller.js";
const router = express.Router()

router.post('/',createCheckoutSession)



export default router