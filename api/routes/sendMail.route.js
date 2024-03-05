import express  from "express";
import {contactUs,forgetPassword} from "../controllers/sendMail.controller.js";
const router = express.Router()

router.post('/contact-us',contactUs)
router.post('/reset-password',forgetPassword)


export default router