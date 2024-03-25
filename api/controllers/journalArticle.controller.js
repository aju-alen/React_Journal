import { PrismaClient } from "@prisma/client"
import createError from '../utils/createError.js'
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
        res.status(201).json({ message: 'Journal Article created successfully', journalArticle, updatedJournal });
      } catch (err) {
        console.error(err);
        await prisma.$disconnect();
        return next(createError(400, 'An error occurred'));
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
        res.status(200).json(journalArticle);
    }
    catch (err) {
        console.log(err);
        return next(createError(400, 'An error occurred'));
        
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
        const journalArticle = await prisma.article.findMany({
            where: {
                isPublished: true
            }, orderBy: {
                createdAt: 'desc'
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