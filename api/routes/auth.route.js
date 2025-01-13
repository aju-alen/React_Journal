import express  from "express";
import { register,login,logout,verifyEmail,forgetPassword,resetPassword,sendMarkettingEmail,verifyResetPassword} from "../controllers/auth.controller.js";
const router = express.Router()

router.post('/register',register)
router.get('/verify/:token/:emailId', verifyEmail);
router.post('/login',login)
router.get('/logout',logout)
router.post('/forget-password',forgetPassword)
router.post('/reset/:resetToken',resetPassword)
router.post('/send-marketing-email',sendMarkettingEmail)
router.get('/reset-password/:resetTokenWithTimestamp',verifyResetPassword)


export default router