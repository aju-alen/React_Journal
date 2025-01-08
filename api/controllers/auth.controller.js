import jsonWebToken from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import createError from '../utils/createError.js'
import dotenv from 'dotenv'
import { emailVerifyBackendUrl, emailUrl } from '../utils/cors.dev.js'
dotenv.config()

const prisma = new PrismaClient();
export const register = async (req, res, next) => {
    console.log(req.body);
    try {
        const finduser = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            }
        })
        if (finduser) {
            if (finduser.emailVerified === true) {
                return next(createError(400, 'User already exists'))
            }
            else if (finduser.emailVerified === false) {
                await prisma.user.delete({
                    where: {
                        email: req.body.email
                    }
                })
                return next(createError(400, 'User already exists but verification link has expired. Please register again'))
            }
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
                marketingCommunications: req.body.marketingCommunications,
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
export const createTransport = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_AUTH_USER,
        pass: process.env.GMAIL_AUTH_PASS
    }
})

// not a route controller, function to send verification email
const sendVerificationEmail = async (email, verificationToken, name) => {
    const timestamp = Date.now(); // Current timestamp
    const tokenWithTimestamp = `${verificationToken}.${timestamp}`; // Concatenate token and timestamp
    console.log(email, 'email');

    const transporter = createTransport;
    const mailOptions = {
        from: process.env.GMAIL_AUTH_USER,
        to: email,
        subject: 'Verify Your Email Address',
        html: `
    <html>
    <body>
        <div>

            <img src="https://i.postimg.cc/1t8pRMxx/logo-removebg-preview.jpg" alt="email verification" style="display:block;margin:auto;width:50%;" />
            <p>Scientific Journals Portal</p>

        </div>S
        <div>
            <p>Hi ${name},</p>
            <p>You're almost there.</p>
            <br>
            <p>We just need to verify your email address before you can access your Scientific Journals Portal. Verifying your email address helps secure your account.</p>
            <br>
            <p><a href="${emailVerifyBackendUrl}/api/auth/verify/${tokenWithTimestamp}/${email}">VERIFY YOUR EMAIL</a></p>
            <p>Note: This link will expire in 48 hours.</p>
            <br>
            <p>Cannot verify your email by clicking the button? Copy and paste the URL into your browser to verify your email.</p>
            <br>
            <p>${emailVerifyBackendUrl}/api/auth/verify/${tokenWithTimestamp}/${email}</p>
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
        console.log(req.params, 'req.params');
        const emailVerificationToken = req.params.token;
        const emailId = req.params.emailId;
        const expirationTime = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
        const currentTime = Date.now();

        if (currentTime - emailVerificationToken.split('.')[1] > expirationTime) {

            await prisma.user.delete({
                where: {
                    email: emailId
                }
            })

            return res.status(400).json({ message: 'Link Expired. Please register again.' })
        }
        const userToken = await prisma.user.findFirst({
            where: {
                emailVerificationToken: emailVerificationToken.split('.')[0]
            }
        })
        console.log(userToken, 'userToken');
        if (!userToken) {
            return res.status(400).json({ message: 'Invalid token' })
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userToken.id
            },
            data: {
                emailVerified: true,
                emailVerificationToken: ''
            }
        })
        await prisma.$disconnect()
        sendWelcomeEmail(updatedUser.email, updatedUser.surname);
        console.log(updatedUser, 'updatedUser');
        // res.status(200).json({ message: 'Email verified' })
        res.redirect(`${emailUrl}/login`)
    }
    catch (err) {
        console.log(err);
        res.status(400).send('An error occoured')
    }
}

const sendWelcomeEmail = async (email, name) => {

    const transporter = createTransport;
    const mailOptions = {
        from: process.env.GMAIL_AUTH_USER,
        to: email,
        subject: 'Welcome to the Scientific Journals Portal(SJP)',
        html: `
    <html>
    <body>
        <div>

            <img src="https://i.postimg.cc/1t8pRMxx/logo-removebg-preview.jpg" alt="email verification" style="display:block;margin:auto;width:50%;" />
            <p>Scientific Journals Portal</p>

        </div>
        <div>
            <p>Welcome ${name},</p>
            <p>With your Scientific Journals Portal account you can sign in, edit your details and make institutional connections for a range of the Scientific Journals Portal products.</p>
            <br>
            <p>The Scientific Journals Team</p>
            <br>
            <p><a href="${emailUrl}">View Your Scientific Journals Portal Account</a></p>
            <br>
            <p>--------------------</p>
            <p>Copyright © 2024, Scientific Journals Portal, its licensors and distributors. All rights are reserved, including those for text and data mining.</p>
            <br>
            <p> <a href="${emailUrl}">About SJP</a></p>
            <br>
            <p><a href="${emailUrl}/terms">Terms and conditions</a></p>
            <br>
            <p> <a href="${emailUrl}/policies">Privacy policy</a></p>
            <br>
            <p> <a href="${emailUrl}/contact">Help</a></p>
            <br>
            <p>We use cookies to help provide and enhance our service. By continuing you agree to the use of cookies.</p>
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
            return res.status(400).json({ message: 'Wrong password or username' })
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

export const forgetPassword = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email
            }

        })
        if (!user) {
            return next(createError(400, 'User does not exists'))
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        await prisma.user.update({
            where: {
                email: req.body.email
            },
            data: {
                resetToken: resetToken
            }
        })
        console.log("reached");
        await prisma.$disconnect()
        console.log(req.body.email, resetToken, user.surname, 'user in forget password');
        sendResetPassword(req.body.email, resetToken, user.surname);
        res.status(200).json({ message: 'Password reset link sent to your email' })
    }
    catch (err) {
        console.log(err);
        res.status(400).send('An error occoured')
    }
}
const sendResetPassword = async (email, resetToken, name) => {
    const timestamp = Date.now(); // Current timestamp
    const resetTokenWithTimestamp = `${resetToken}.${timestamp}`; // Concatenate token and timestamp
    console.log(email, 'email');



    const transporter = createTransport;
    const mailOptions = {
        from: process.env.GMAIL_AUTH_USER,
        to: email,
        subject: 'Reset Password',
        html: `
    <html>
    <body>
        <div>
            <img src="https://i.postimg.cc/1t8pRMxx/logo-removebg-preview.jpg" alt="email verification" style="display:block;margin:auto;width:50%;" />
        </div>
        <div>
            <p>Hi ${name},</p>
            <p>Click to reset your password:</p>
            <br>
            <p><a href="${emailVerifyBackendUrl}/api/auth/reset-password/${resetTokenWithTimestamp}">Reset Your Password</a></p>
            <p>Note: This link will expire in 30 minutes. If expired, you can create a forget password request again.</p>
            <br>
            <p>Warm Regards</p>
            <p>Scientific Journals Team</p>
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

export const verifyResetPassword = async (req, res) => {
    const resetTokenWithTimestamp = req.params.resetTokenWithTimestamp;
    try{
        const expirationTime = 30* 60 * 1000; // 30 mins in milliseconds
        const currentTime = Date.now();
        if (currentTime - resetTokenWithTimestamp.split('.')[1] > expirationTime) {
            return res.status(400).json({ message: 'Link Expired. You can try again.' })
        }
        else{
            return res.redirect(`${emailUrl}/reset-password/${resetTokenWithTimestamp.split('.')[0]}`)
        }


    }
    catch(err){
        console.log(err);
        res.status(400).send('An error occoured')
    
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

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' })
        }
        const hash = await bcrypt.hash(req.body.password, 10);
        await prisma.user.update({
            where: {
                resetToken: resetToken,
            },
            data: {
                password: hash,
            }
        })
        await prisma.$disconnect()
        res.status(200).json({ message: 'Password reset successful' })

    }
    catch (err) {
        console.log(err);
        res.status(400).send('An error occoured')
    }


}

export const sendMarkettingEmail = async (req, res) => {
    console.log(req.body, 'req.body');
    const subject = req.body.subject;
    const emailParagraph1 = req.body.emailParagraph1;
    const emailParagraph2 = req.body.emailParagraph2;
    const emailParagraph3 = req.body.emailParagraph3;

    try {
        const users = await prisma.user.findMany({
            select: {
                email: true
            },
            where: {
                marketingCommunications: true
            }
        })
        console.log(users, 'users');

        const emailAddresses = users.map(entry => entry.email);

        // Join email addresses separated by commas
        const allEmailIds = emailAddresses.join(',');
        sendMarkettingEmailFinal(allEmailIds, emailParagraph1, emailParagraph2, emailParagraph3,subject);


        res.status(200).json({ message: 'Email sent successfully' })
    }
    catch (err) {
        console.log(err);
        res.status(400).send('An error occoured')
    }

}

 const sendMarkettingEmailFinal = async (emails, emailParagraph1,emailParagraph2,emailParagraph3,subject) => {



    const transporter = createTransport;
    const mailOptions = {
        from: process.env.GMAIL_AUTH_USER,
        subject: subject,
        html: `
    <html>
    <body>
        <div>
            <img src="https://i.postimg.cc/1t8pRMxx/logo-removebg-preview.jpg" alt="email verification" style="display:block;margin:auto;width:50%;" />
        </div>
        <div>
            <p>Hi there,</p>
            <br>
            <p>${emailParagraph1}</p>
            <br>
            <p>${emailParagraph2}</p>
            <br>
            <p>${emailParagraph3}</p>
            <br>
            <p>Warm Regards</p>
            <p>Scientific Journals Team</p>
        </div>
    </body>
    </html>`,
    bcc: emails
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