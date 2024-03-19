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

// not a route controller, function to send verification email
const sendVerificationEmail = async (email, verificationToken, name) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_AUTH_USER,
            pass: process.env.GMAIL_AUTH_PASS
        }
    })
    const mailOptions = {
        from: process.env.GMAIL_AUTH_USER,
        to: email,
        subject: 'Account Verification',
        text: `
        Hi ${name},

        Please click the link below to verify your account: ${emailVerifyBackendUrl}/api/auth/verify/${verificationToken}`
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