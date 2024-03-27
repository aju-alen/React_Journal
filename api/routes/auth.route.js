import express  from "express";
import { register,login,logout,verifyEmail,forgetPassword,resetPassword} from "../controllers/auth.controller.js";
const router = express.Router()

router.post('/register',register)
router.get('/verify/:token', verifyEmail);
router.post('/login',login)
router.get('/logout',logout)
router.post('/forget-password',forgetPassword)
router.post('/reset/:resetToken',resetPassword)


export default router