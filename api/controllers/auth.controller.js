import jsonWebToken from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import createError from '../utils/createError.js'
import dotenv from 'dotenv'
import {emailVerifyBackendUrl} from '../utils/cors.dev.js'
dotenv.config()

const prisma = new PrismaClient();
export const register = async (req, res, next) => {
    console.log(req.body);
    try {
        const finduser = await prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        })
        if (finduser) {
            return next(createError(400, 'User already exists'))
        }
        console.log('this is the req from the client', req.body);
        const hash = await bcrypt.hash(req.body.password, 10);
        //generate the verification token
        const emailVerificationToken = crypto.randomBytes(64).toString('hex');

        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                password: hash,
                title: req.body.title,
                surname: req.body.surname,
                otherName: req.body.otherName,
                affiliation: req.body.affiliation,
                label: req.body.label,
                value: req.body.value,
                emailVerificationToken: emailVerificationToken,
            }
        })
        await prisma.$disconnect()
        console.log(emailVerificationToken, 'emailVerificationToken');
        sendVerificationEmail(req.body.email, emailVerificationToken, req.body.surname);
        res.status(201).json({ message: 'User created, please verify your details', user })
    }
    catch (err) {
        console.log(err);
        res.status(400).send('An error occoured')
    }
}
const createTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_AUTH_USER,
        pass: process.env.GMAIL_AUTH_PASS
    }
})

// not a route controller, function to send verification email
const sendVerificationEmail = async (email, verificationToken, name) => {

    const transporter = createTransport;
    const mailOptions = {
        from: process.env.GMAIL_AUTH_USER,
        to: email,
        subject: 'Account Verification',
        html: `
    <html>
    <body>
        <div>
            <img src="https://i.postimg.cc/nr8B09zy/Scientific-Journals-Portal-04.png" alt="email verification" style="display:block;margin:auto;width:50%;" />
        </div>
        <div>
            <p>Hi ${name},</p>
            <p>Please click the link below to verify your account:</p>
            <p><a href="${emailVerifyBackendUrl}/api/auth/verify/${verificationToken}">${emailVerifyBackendUrl}/api/auth/verify/${verificationToken}</a></p>
        </div>
    </body>
    </html>`
    }

    //send the mail
    try {
        const response = await transporter.sendMail(mailOptions);
        console.log("Verification email sent", response);
    }
    catch (err) {
        console.log("Err sending verification email", err);
    }
}

export const verifyEmail = async (req, res) => {
    try {

        const emailVerificationToken = req.params.token;
        console.log(emailVerificationToken, 'emailVerificationToken');
       const userToken = await prisma.user.findUnique({
            where: {
                emailVerificationToken: emailVerificationToken
            }
        })
        console.log(userToken, 'userToken');
        if (!userToken) {
            return res.status(400).json({ message: 'Invalid token' })
        }
    
        await prisma.user.update({
            where: {
                id: userToken.id
            },
            data: {
                emailVerified: true,
                emailVerificationToken: ''
            }
        })
        await prisma.$disconnect()
        res.status(200).json({ message: 'Email verified' })
    }
    catch (err) {
        console.log(err);
        res.status(400).send('An error occoured')
    }
}

export const login = async (req, res, next) => {
    try {
        const finduser = await prisma.user.findUnique({
            where: {
                email: req.body.email,
                emailVerified: true
            }
        })
        if (!finduser) {
            return next(createError(400, 'User does not exists'))
        }
        let isCorrect = bcrypt.compareSync(req.body.password, finduser.password)
        if (!isCorrect) {
            return res.send('Wrong password or username')
        }
        const token = jwt.sign(
            { id: finduser.id },
            process.env.SECRET,
        )

        console.log(process.env.SECRET, 'secret key');
        console.log(finduser, 'userDetails in the backend');
        const { password, ...user } = finduser

        await prisma.$disconnect()
        res.status(200).json({ message: "Login successful", token, user });
        console.log(token);
    }
    catch (err) {
        console.log(err);
        res.status(400).send('An error occoured')
    }
}
export const logout = async (req, res) => {
    res.clearCookie("accessToken", { sameSite: 'none', secure: true }).status(200).json({ message: "User logged out" })
}

export const forgetPassword = async (req, res,next) => {
    try{
        const user = await prisma.user.findUnique({
            where:{
                email:req.body.email
            }

        })
        if(!user){
            return next(createError(400, 'User does not exists'))
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        await prisma.user.update({
            where:{
                email:req.body.email
            },
            data:{
                resetToken:resetToken
            }
        })
        console.log("reached");
        await prisma.$disconnect()
        console.log(req.body.email,resetToken,user.surname, 'user in forget password');
        sendResetPassword(req.body.email, resetToken, user.surname);
        res.status(200).json({message:'Password reset link sent to your email'})
    }
    catch(err){
        console.log(err);
        res.status(400).send('An error occoured')
    }
}
const sendResetPassword = async (email, resetToken, name) => {

    const transporter = createTransport;
    const mailOptions = {
        from: process.env.GMAIL_AUTH_USER,
        to: email,
        subject: 'Reset Password',
        html: `
    <html>
    <body>
        <div>
            <img src="https://i.postimg.cc/nr8B09zy/Scientific-Journals-Portal-04.png" alt="email verification" style="display:block;margin:auto;width:50%;" />
        </div>
        <div>
            <p>Hi ${name},</p>
            <p>Click to reset your password:</p>
            <p><a href="http://localhost:5173/reset-password/${resetToken}">Reset Password</a></p>
        </div>
    </body>
    </html>`
    }

    //send the mail
    try {
        const response = await transporter.sendMail(mailOptions);
        console.log("Reset Password email sent", response);
    }
    catch (err) {
        console.log("Err sending Reset Password email", err);
    }
}

export const resetPassword = async (req, res) => {
    const resetToken = req.params.resetToken;
    console.log(resetToken, 'resetToken');
    console.log(req.body.password, 'password');
    try {
        const user = await prisma.user.findFirst({
            where: {
                resetToken,
            }
          });

        if(!user){
            return res.status(400).json({message:'Invalid token'})
        }
        const hash = await bcrypt.hash(req.body.password, 10);
        await prisma.user.update({
            where:{
                resetToken:resetToken,
            },
            data:{
                password:hash,
                resetToken:''
            }
        })
        await prisma.$disconnect()
        res.status(200).json({message:'Password reset successful'}) 

    }
    catch (err) {
        console.log(err);
        res.status(400).send('An error occoured')
    }

       
}