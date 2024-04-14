import express  from "express";
import { getFullIssuePurchasedUser } from "../controllers/userFullissue.controller.js";
import { verifyToken } from "../middleware/jwt.js";
const router = express.Router()

router.get('/getfullissue',verifyToken, getFullIssuePurchasedUser);



export default router