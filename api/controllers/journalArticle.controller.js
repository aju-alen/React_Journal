import { PrismaClient } from "@prisma/client"
import createError from '../utils/createError.js'
import nodemailer from "nodemailer";
import { createTransport } from "./auth.controller.js";
const prisma = new PrismaClient()


export const createJournalArticle = async (req, res, next) => {
    
    console.log(req.body.publicPdfName,"public pdf name");
    try {
        const journalArticle = await prisma.article.create({
          data: {
            articleTitle: req.body.articleTitle,
            articleAbstract: req.body.articleAbstract,
            articleKeywords: req.body.articleKeywords,
            specialReview: req.body.specialReview,
            journalId: req.body.journalId,
            userId: req.body.userId,
            articleAuthors: req.body.authors,
            filesURL: req.body.filesUrl,
            awsId: req.body.awsId,
            rejectionFilesURL:[],
            publicPdfName: req.body.publicPdfName,
            articleIssue: req.body.articleIssue,
            articleVolume: req.body.articleVolume,
          },
        });        
      
        const updatedJournal = await prisma.journal.update({
          where: { id: req.body.journalId },
          data: {
            articles: {
              connect: { id: journalArticle.id },
            },
          },
        });
        const updatedUser = await prisma.user.update({
          where: { id: req.body.userId },
          data: {
            articles: {
              connect: { id: journalArticle.id },
            },
          },
        });
      
        await prisma.$disconnect();
        sendArticleSubmittedEmail(req.body.authors[0].authorEmail);

        res.status(201).json({ message: 'Journal Article created successfully', journalArticle, updatedJournal });
      } catch (err) {
        console.error(err);
        await prisma.$disconnect();
        return next(createError(400, 'An error occurred'));
      }

}

const sendArticleSubmittedEmail = async (email) => {
    const transporter = createTransport; 
    const mailOptions = {
        from: process.env.GMAIL_AUTH_USER,
        to: email,
        subject: 'Article Submitted Successfully',
        html: `
    <html>
    <body>
        <div>

            <img src="https://i.postimg.cc/44M0PRYR/logo-removebg-preview.jpg" alt="email verification" style="display:block;margin:auto;width:50%;" />
            <p>Scientific Journals Portal</p>

        </div>
        <div>
            <p>Hi there,</p>
            <p>I am delighted to inform you that your article submission has been successfully received.</p>
            <br>
            <p>Our team will now carefully evaluate your submission, and we will keep you informed throughout the review process. Should there be any additional information required or updates regarding your article, we will promptly reach out to you.</p>
            <br>
            <p>Warm regards,</p>
            <p>Scientific Journals Portal</p>
        </div>
    </body>
    </html>`
    }

    //send the mail
    try {
        const response = await transporter.sendMail(mailOptions);
        console.log("Article Submission email Sent", response);
    }
    catch (err) {
        console.log("Err sending Article Submission email", err);
    }
}


export const getAllJournalArticle = async (req, res, next) => {
    try {
        const journalArticle = await prisma.user.findUnique({
            where: { id: 1 },
            include: { articles: true }
        });
        console.log(journalArticle);
        res.status(200).json(journalArticle);
    }
    catch (err) {
        console.log(err);
        return next(createError(400, 'An error occurred'));
        
    }
    
   
}

export const getAllArticlesToVerify = async (req, res, next) => {
    try {
        const journalArticle = await prisma.article.findMany({
            where: {
                isReview: true,
                isPublished: false
            }
        });
        console.log(journalArticle);
        res.status(200).json(journalArticle);
    }
    catch (err) {
        console.log(err);
        return next(createError(400, 'An error occurred'));
        
    }
}

export const postRejectionText = async (req, res, next) => {
    try {
        const journalArticle = await prisma.article.update({
            where: { id: req.body.articleId },
            data: {
                rejectionText: req.body.rejectionText,
                articleStatus: 'Rejected, waiting for user to edit and resend',
                isReview: false,
                rejectionFilesURL:req.body.filesUrl
            }
        });
        console.log(journalArticle);
        await prisma.$disconnect();
        sendArticleRejectionEmail(req.body.emailId);
        res.status(200).json(journalArticle);
    }
    catch (err) {
        console.log(err);
        return next(createError(400, 'An error occurred'));
        
    }

}

const sendArticleRejectionEmail = async (email) => {
    const transporter = createTransport; 
    const mailOptions = {
        from: process.env.GMAIL_AUTH_USER,
        to: email,
        subject: 'Article Submission Revision Required',
        html: `
    <html>
    <body>
        <div>

            <img src="https://i.postimg.cc/44M0PRYR/logo-removebg-preview.jpg" alt="email verification" style="display:block;margin:auto;width:50%;" />
            <p>Scientific Journals Portal</p>

        </div>
        <div>
            <p>Hi there,</p>
            <p>I hope this email finds you well. I wanted to personally update you regarding the status of your recent article submission.</p>
            <br>
            <p>After careful review by our editorial team, unfortunately, we have decided that your article does not meet our current publication standards. However, please don't be discouraged as your effort is highly appreciated.</p>
            <br>
            <p>We believe that with some revisions, your article could align more closely with our requirements. Therefore, we have returned it to your dashboard for further editing. Please take some time to review the feedback provided and make the necessary adjustments.</p>
            <br>
            <p>Should you have any questions or require clarification on any points raised in the feedback, please don't hesitate to reach out to us. We are here to support you throughout this process.

            Thank you for your understanding and cooperation. We truly value your contributions and look forward to the possibility of reconsidering your article for publication after the revisions.</p>
            <br>
            <p>Warm regards,</p>
            <p>Scientific Journals Portal</p>
        </div>
    </body>
    </html>`
    }

    //send the mail
    try {
        const response = await transporter.sendMail(mailOptions);
        console.log("Article Submission email Sent", response);
    }
    catch (err) {
        console.log("Err sending Article Submission email", err);
    }
}

export const getSingleArticle = async (req, res, next) => {
    try {
        const journalArticle = await prisma.article.findUnique({
            where: { id: req.params.articleId }
        });
        console.log(journalArticle);
        res.status(200).json(journalArticle);
    }
    catch (err) {
        console.log(err);
        return next(createError(400, 'An error occurred'));
        
    }
}

export const getSinglePublishedArticle = async (req, res, next) => {
    try {
        const journalArticle = await prisma.article.findUnique({
            where: { id: req.params.articleId,isPublished:true }
        });
        console.log(journalArticle,"journal Article in api");
        res.status(200).json([journalArticle]);
    }
    catch (err) {
        console.log(err);
        return next(createError(400, 'An error occurred'));
        
    }
}

export const deleteArticle = async (req, res, next) => {
    const {articleId} = req.params;
    console.log(articleId, 'articleId');
    console.log(req.userId, 'req.userId');
    if(req.userId !== req.params.userId){
        return next(createError(401, 'Not authorized to delete article'));
    }
    try{
        const article = await prisma.article.delete({
            where: {
                id: articleId,
                userId: req.userId
            },
        });        
        res.status(200).json({message: 'Article deleted successfully', title:article.articleTitle});
    }
    catch{
        console.log(err);
        return next(createError(400, 'An error occurred'));

        
    }
}

export const updateJournalArticle = async (req, res, next) => {
    try {
        const journalArticle = await prisma.article.update({
            where: { id: req.params.articleId },
            data: {
                articleTitle: req.body.articleTitle,
                articleAbstract: req.body.articleAbstract,
                articleKeywords: req.body.articleKeywords,
                filesURL: req.body.filesUrl,
                isReview: true,
                articleStatus: 'In Review',
                rejectionText: '',
                publicPdfName: req.body.publicPdfName,
            }
        });
        console.log(journalArticle);
        res.status(200).json(journalArticle);
    }
    catch (err) {
        console.log(err);
        return next(createError(400, 'An error occurred'));
        
    }
}

export const acceptManuscript = async (req, res, next) => {
    try {
        if(req.isAdmin === false) {
            return next(createError(401, 'Not authorized to accept article'));
        }
        const journalArticle = await prisma.article.update({
            where: { id: req.body.articleId },
            data: {
                isPublished: true,
                articleStatus: 'Published',
                isReview: false,
                rejectionFilesURL:[],
            }
        });
        console.log(journalArticle);
        res.status(200).json(journalArticle);
    }
    catch (err) {
        console.log(err);
        return next(createError(400, 'An error occurred'));
        
    }
}

export const getPublsihedJournalArticle = async (req, res, next) => {
    try {
        // const journalArticle = await prisma.journal.findMany({
        //     where: {
        //         id: "57048a90-aa37-4716-bba1-cce74d449da6"
        //     }, 
        //     include: {
        //         articles: true
        //     }
        // });
        const journalArticle = await prisma.article.findMany({
            where: {
                isPublished: true
            }, 
            orderBy: {
                articlePublishedDate: 'desc'
            }
        });
        res.status(200).json(journalArticle);
    }
    catch (err) {
        console.log(err);
        return next(createError(400, 'An error occurred'));
        
    }
}