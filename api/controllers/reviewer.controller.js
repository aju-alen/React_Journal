import { PrismaClient } from '@prisma/client'
import createError from '../utils/createError.js'
import { resendEmailBoiler } from '../utils/resend-email-boiler.js';
import { reviewerApprovalTemplate } from '../utils/emailTemplates.js';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

export const getAllReviewers = async (req, res, next) => {
    try {
        if (!req.isAdmin) {
            return next(createError(403, 'Only admins can access this resource'))
        }

        const reviewers = await prisma.user.findMany({
            where: {
                userType: 'reviewer'
            },
            select: {
                id: true,
                email: true,
                surname: true,
                otherName: true,
                title: true,
                affiliation: true,
                cvUrl: true,
                reviewerApproved: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        await prisma.$disconnect()
        res.status(200).json(reviewers)
    }
    catch (err) {
        console.log(err);
        await prisma.$disconnect()
        res.status(400).send('An error occurred')
    }
}

export const approveReviewer = async (req, res, next) => {
    try {
        if (!req.isAdmin) {
            return next(createError(403, 'Only admins can perform this action'))
        }

        const { userId } = req.params;
        
        const reviewer = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!reviewer) {
            return next(createError(404, 'Reviewer not found'))
        }

        if (reviewer.userType !== 'reviewer') {
            return next(createError(400, 'User is not a reviewer'))
        }

        const updatedReviewer = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                reviewerApproved: true
            }
        })

        await prisma.$disconnect()

        // Send approval email
        const emailHtml = reviewerApprovalTemplate(
            reviewer.surname || reviewer.otherName || 'Reviewer',
            reviewer.email
        );

        try {
            await resendEmailBoiler(
                process.env.GMAIL_AUTH_USER,
                reviewer.email,
                'Reviewer Application Approved - Scientific Journals Portal',
                emailHtml
            )
        } catch (emailErr) {
            console.error('Error sending approval email:', emailErr);
            // Don't fail the request if email fails
        }

        res.status(200).json({ message: 'Reviewer approved successfully', reviewer: updatedReviewer })
    }
    catch (err) {
        console.log(err);
        await prisma.$disconnect()
        res.status(400).send('An error occurred')
    }
}

export const rejectReviewer = async (req, res, next) => {
    try {
        if (!req.isAdmin) {
            return next(createError(403, 'Only admins can perform this action'))
        }

        const { userId } = req.params;
        
        const reviewer = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!reviewer) {
            return next(createError(404, 'Reviewer not found'))
        }

        if (reviewer.userType !== 'reviewer') {
            return next(createError(400, 'User is not a reviewer'))
        }

        const updatedReviewer = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                reviewerApproved: false
            }
        })

        await prisma.$disconnect()

        res.status(200).json({ message: 'Reviewer rejected successfully', reviewer: updatedReviewer })
    }
    catch (err) {
        console.log(err);
        await prisma.$disconnect()
        res.status(400).send('An error occurred')
    }
}

