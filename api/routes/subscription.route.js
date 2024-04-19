import express  from "express";
import {getSubscriptionDetails} from '../controllers/subscription.controller.js'
import { verifyToken } from "../middleware/jwt.js";
const router = express.Router()


router.get('/user-details/:emailId',verifyToken,getSubscriptionDetails);



export default router