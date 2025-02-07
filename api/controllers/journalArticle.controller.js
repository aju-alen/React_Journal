import { PrismaClient } from "@prisma/client"
import createError from '../utils/createError.js'
import fetch from 'node-fetch';
import { createTransport } from "./auth.controller.js";
import PDFDocument from "pdfkit";
import { S3 } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { Buffer } from 'buffer';
import QRCode from 'qrcode';
dotenv.config();
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

            <img src="https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/logo-removebg-preview.jpg" alt="email verification" style="display:block;margin:auto;width:50%;" />
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
            },
            select: {
                // Select all fields from Article
                id: true,
                articleTitle: true,
                articleAbstract: true,
                articleKeywords: true,
                articleAuthors: true,
                filesURL: true,
                articleIssue: true,
                articleVolume: true,
                paymentStatus: true,
                rejectionFilesURL: true,
                publicPdfName: true,
                awsId: true,
                rejectionText: true,
                specialReview: true,
                isReview: true,
                isPublished: true,
                isAccepted: true,
                articleStatus: true,
                articleReceivedDate: true,
                articleAcceptedDate: true,
                articlePublishedDate: true,
                journalId: true,
                userId: true,
                createdAt: true,
                updatedAt:true,
                
                // Select specific fields from articlePublishedJournal (Journal)
                articlePublishedJournal: {
                    select: {
                        id: true,
                        journalAbbreviation: true
                    }
                }
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

            <img src="https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/logo-removebg-preview.jpg" alt="email verification" style="display:block;margin:auto;width:50%;" />
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
const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

// Initialize S3 client
const s3 = new S3({
    credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY
    },
    region: REGION
});


//article title, abbr, vol issue still pending
export const downloadCertificate = async (req, res, next) => {
    console.log(req.body);

    try {
        const { articleId,
            articleTitle,
            articleIssue,
            articleVolume,
            awsId,
            userId,
            authorGivenName,
            journalAbbreviation,
            pdfName,
            publishedDate
         } = req.body;
         console.log(req.body,'asdasdas');
         

        if (!authorGivenName || !articleTitle || !journalAbbreviation || !articleVolume || !articleIssue) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        // Generate verification URL for QR code
        const verificationUrl = `https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/${userId}/${awsId}/${pdfName}`;
        
        // Generate QR code as a data URL
        const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 200,
            color: {
                dark: '#1f497d',  // QR code color matching the certificate theme
                light: '#ffffff'  // Background
            }
        });

        // Create a PDF document in landscape mode
        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4',
            margin: 0
        });

        // Instead of piping to response, collect the chunks
        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', async () => {
            const pdfBuffer = Buffer.concat(chunks);

            try {
                const filename = `${userId}/${awsId}/certificate.pdf`;

                // Upload to S3
                const uploadParams = {
                    Bucket: BUCKET_NAME,
                    Key: filename,
                    Body: pdfBuffer,
                    ContentType: 'application/pdf'
                };

                await s3.putObject(uploadParams);

                res.status(200).json({
                    message: 'Certificate generated and uploaded successfully',
                    key: filename
                });
            } catch (uploadErr) {
                console.error('S3 Upload Error:', uploadErr);
                return next(createError(500, 'Failed to upload certificate'));
            }
        });

        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;

        // Background Color
        doc.rect(0, 0, pageWidth, pageHeight).fill('#f9f9f9');

        // Outer Border
        const borderWidth = 30;
        doc.rect(borderWidth, borderWidth, pageWidth - (borderWidth * 2), pageHeight - (borderWidth * 2))
            .lineWidth(4)
            .stroke('#1f497d');

        // Inner Border
        doc.rect(borderWidth + 15, borderWidth + 15, pageWidth - (borderWidth * 2) - 30, pageHeight - (borderWidth * 2) - 30)
            .lineWidth(2)
            .stroke('#1f497d');

        // Header - Certificate Title
        doc.font('Helvetica-Bold')
            .fontSize(35)
            .fillColor('#1f497d')
            .text('Certificate of Publication', 0, 100, { align: 'center' });

        // Decorative Line under the title
        doc.moveTo(pageWidth / 2 - 120, 160)
            .lineTo(pageWidth / 2 + 120, 160)
            .lineWidth(3)
            .stroke('#1f497d');

        // Main Text - Certification Line
        doc.font('Helvetica')
            .fontSize(15)
            .fillColor('#333333')
            .text('This is to certify that', 0, 190, { align: 'center' });

        // Author Name (Bold & Highlighted)
        doc.font('Helvetica-Bold')
            .fontSize(32)
            .fillColor('#1f497d')
            .text(authorGivenName, 0, 240, { align: 'center' });

        // Publication Details (Centered, Readable)
        doc.font('Helvetica')
            .fontSize(15)
            .fillColor('#333333')
            .text(
                `has successfully published an article titled:`,
                0, 290, { align: 'center' }
            );

        // Article Title (Bold & Larger)
        doc.font('Helvetica-Bold')
            .fontSize(18)
            .fillColor('#1f497d')
            .text(`"${articleTitle}"`, 50, 330, {
                align: 'center',
                width: pageWidth - 100
            });

        // Journal, Volume & Issue Details
        doc.font('Helvetica')
            .fontSize(14)
            .fillColor('#333333')
            .text(`in ${journalAbbreviation}, Volume ${articleVolume}, Issue ${articleIssue}.`, 50, 380, {
                align: 'center',
                width: pageWidth - 100
            });

        // Date of Awarding
        const currentDate = new Date().toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        doc.font('Helvetica')
            .fontSize(15)
            .fillColor('#333333')
            .text(`Awarded on ${publishedDate}`, 0, 440, { align: 'center' });

        // Calculate positions for better alignment
        const signatureStartY = pageHeight - 180;  // Moved up slightly
        const textStartY = signatureStartY + 90;   // Adjusted for spacing after signature
        const columnWidth = 300;
        const leftColumnX = pageWidth * 0.25 - columnWidth/2;  // Center of left half
        const rightColumnX = pageWidth * 0.75 - columnWidth/2; // Center of right half

        // Left Column - Signature Image and Text
        const imageUrl = 'https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/WhatsApp+Image+2025-02-04+at+14.58.37.jpeg';
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();

        // Center the signature image in the left column
        doc.image(imageBuffer, leftColumnX + 75, signatureStartY, {
            width: 150,
            height: 70,
            align: 'center'
        });

        // Text below signature on left side
        doc.font('Helvetica-Oblique')
            .fontSize(11)
            .fillColor('#333333')
            .text(
                "This is an electronically generated document and does not require a signature.",
                leftColumnX, textStartY,
                {
                    width: columnWidth,
                    align: 'center'
                }
            );

        // Right Column - QR Code and Chairman Text
        // Center QR code in right column
        doc.image(qrCodeDataUrl, rightColumnX + 115, signatureStartY, {
            width: 70,
            height: 70
        });

        // Chairman text below QR code - aligned with QR code
        doc.font('Helvetica')
            .fontSize(11)
            .fillColor('#333333')
            .text(
                "Editorial Board Chairman:",
                rightColumnX, textStartY,
                {
                    width: columnWidth,
                    align: 'center'
                }
            );

        // Name with less spacing after title
        doc.font('Helvetica-Bold')
            .fontSize(13)
            .fillColor('#1f497d')
            .text(
                "Dr. El Hadi Idriss",
                rightColumnX, textStartY + 20,
                {
                    width: columnWidth,
                    align: 'center'
                }
            );

        // Finalize PDF
        doc.end();
    } catch (err) {
        console.error('Certificate Generation Error:', err);
        return next(createError(400, 'An error occurred while generating the certificate'));
    }
};

// Optional: Add a function to get a certificate by its key
export const getCertificate = async (req, res, next) => {
    try {
        const { key } = req.params;

        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key
        });

        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

        res.json({ downloadUrl: url });
    } catch (err) {
        console.error('Get Certificate Error:', err);
        return next(createError(500, 'Failed to retrieve certificate'));
    }
};