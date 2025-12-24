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
import { resendEmailBoiler } from '../utils/resend-email-boiler.js';
import { emailVerificationTemplate, passwordResetTemplate, markettingEmailTemplate, welcomeEmailTemplate, newUserRegistrationNotificationTemplate } from '../utils/emailTemplates.js';
import { S3 } from '@aws-sdk/client-s3';
dotenv.config()

const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

const s3 = new S3({
    credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY
    },
    region: REGION
});

const prisma = new PrismaClient();
export const register = async (req, res, next) => {
    console.log(req.body);
    try {
        const userType = req.body.userType || 'user';
        const email = req.body.email;
        
        const finduser = await prisma.user.findUnique({
            where: {
                email: email,
            }
        })
        if (finduser) {
            if (finduser.emailVerified === true) {
                return next(createError(400, 'User already exists'))
            }
            else if (finduser.emailVerified === false) {
                await prisma.user.delete({
                    where: {
                        email: email
                    }
                })
                return next(createError(400, 'User already exists but verification link has expired. Please register again'))
            }
        }
        console.log('this is the req from the client', req.body);
        
        // Handle CV upload for reviewers
        let cvUrl = null;
        if (userType === 'reviewer') {
            if (!req.file) {
                return next(createError(400, 'CV file is required for reviewers'))
            }
            
            // Validate file is PDF
            if (req.file.mimetype !== 'application/pdf') {
                return next(createError(400, 'CV must be a PDF file'))
            }
            
            // Generate temporary identifier using email (sanitized)
            const tempUserId = email.replace(/[^a-zA-Z0-9]/g, '_');
            
            // Upload CV to S3
            const cvFileName = `cv/${tempUserId}/${req.file.originalname}`;
            const uploadParams = {
                Bucket: BUCKET_NAME,
                Key: cvFileName,
                Body: req.file.buffer,
                ContentType: 'application/pdf'
            };
            
            try {
                await s3.putObject(uploadParams);
                cvUrl = `https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/${cvFileName}`;
                console.log('CV uploaded successfully:', cvUrl);
            } catch (uploadErr) {
                console.error('S3 Upload Error:', uploadErr);
                return next(createError(500, 'Failed to upload CV'))
            }
        }
        
        const hash = await bcrypt.hash(req.body.password, 10);
        //generate the verification token
        const emailVerificationToken = crypto.randomBytes(64).toString('hex');

        const user = await prisma.user.create({
            data: {
                email: email,
                password: hash,
                title: req.body.title,
                surname: req.body.surname,
                otherName: req.body.otherName,
                affiliation: req.body.affiliation,
                label: req.body.label,
                value: req.body.value,
                emailVerificationToken: emailVerificationToken,
                marketingCommunications: req.body.marketingCommunications === 'true' || req.body.marketingCommunications === true,
                userType: userType,
                cvUrl: cvUrl,
                reviewerApproved: userType === 'reviewer' ? false : true,
            }
        })
        await prisma.$disconnect()
        console.log(emailVerificationToken, 'emailVerificationToken');

        const emailHtml = emailVerificationTemplate(
            req.body.surname,
            emailVerificationToken,
            email,
            emailVerifyBackendUrl
        );

        await resendEmailBoiler(
            process.env.GMAIL_AUTH_USER,
            email,
            'Verify your email',
            emailHtml
        )
        
        // Send admin notification email
        const adminNotificationHtml = newUserRegistrationNotificationTemplate(
            userType,
            email,
            req.body.title,
            req.body.surname,
            req.body.otherName,
            req.body.affiliation,
            req.body.label || req.body.value || 'N/A',
            userType === 'reviewer',
            cvUrl
        );
        
        try {
            await resendEmailBoiler(
                process.env.GMAIL_AUTH_USER,
                process.env.GMAIL_AUTH_USER,
                `New ${userType === 'reviewer' ? 'Reviewer' : 'User'} Registration - Scientific Journals Portal`,
                adminNotificationHtml
            );
        } catch (adminEmailErr) {
            console.error('Error sending admin notification email:', adminEmailErr);
            // Don't fail the registration if admin email fails
        }
        
        // sendVerificationEmail(req.body.email, emailVerificationToken, req.body.surname);
        const successMessage = userType === 'reviewer' 
            ? 'Registration successful! Your reviewer application is pending admin approval. You will receive an email notification once your application is reviewed.'
            : 'User created, please verify your details';
        res.status(201).json({ message: successMessage, user })
    }
    catch (err) {
        console.log(err);
        res.status(400).send('An error occoured')
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
            console.log('inside verify if to see if time expired');
            
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
        const emailHtml = welcomeEmailTemplate(
            updatedUser.surname,
            updatedUser.email,
            emailUrl
        );
        await resendEmailBoiler(
            process.env.GMAIL_AUTH_USER,
            updatedUser.email,
            'Welcome to Scientific Journals Portal',
            emailHtml
        )
        console.log(updatedUser, 'updatedUser');
        // res.status(200).json({ message: 'Email verified' })
        res.redirect(`${emailUrl}/login`)
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
            return res.status(400).json({ message: 'Wrong password or username' })
        }
        
        // Check if reviewer is approved
        if (finduser.userType === 'reviewer' && !finduser.reviewerApproved) {
            return res.status(403).json({ message: 'Your reviewer application is pending approval. You will be notified via email once approved.' })
        }
        
        const token = jwt.sign(
            { id: finduser.id, isAdmin: finduser.isAdmin },
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

    const emailHtml = passwordResetTemplate(name, resetTokenWithTimestamp, emailVerifyBackendUrl);

    
try{
    await resendEmailBoiler(
        process.env.GMAIL_AUTH_USER,
        email,
        'Reset Your Password',
        emailHtml
    )

}
    catch(err){
        console.log(err);
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
    const {subject, emailContent, emailType, recipientEmail} = req.body;
    console.log(req.body, 'req.body');

    try {
        if (emailType === 'marketing') {
            console.log('inside if marketting');
            
            const users = await prisma.user.findMany({
                select: {
                    email: true
                },
                where: {
                    marketingCommunications: true
                }
            });
            console.log(users, 'users');
    
            const emailAddresses = users.map(entry => entry.email);
            const allEmailIds = emailAddresses.join(',');
            sendMarkettingEmailFinal(allEmailIds, emailContent, subject);
        }
        else if (emailType === 'specific') {
            sendMarkettingEmailFinal(recipientEmail, emailContent, subject);
        }

        res.status(200).json({ message: 'Email sent successfully' });
    }
    catch (err) {
        console.log(err);
        res.status(400).send('An error occurred');
    }
};

const formatEmailText = (text) => {
    if (!text) return '';
    return text
        .replace(/\n/g, '<br>')
        .replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length));
};

const sendMarkettingEmailFinal = async (emails, emailContent, subject) => {
    const emailHtml = markettingEmailTemplate(emailContent);

   

    try {
        const response = await resendEmailBoiler(
            process.env.GMAIL_AUTH_USER,
            emails.split(','),
            subject,
            emailHtml
        );
        console.log("Emails sent", response);
    }
    catch (err) {
        console.log("Err sending Reset Password email", err);
    }
};