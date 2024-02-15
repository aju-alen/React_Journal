import { PrismaClient } from "@prisma/client"
import createError from '../utils/createError.js'
const prisma = new PrismaClient()


export const createJournalArticle = async (req, res, next) => {
    try {
        const journalArticle = await prisma.article.create({
            data: {
                id: req.body.id,

                articleTitle: req.body.articleTitle,
                
                articleAuthors: req.body.articleAuthors,
                
                articlePublishedDate: req.body.
                
                articlePublishedDate,
                journalId: req.body.journalId,
                
                articleReceivedDate: req.body.articleReceivedDate,
                
                articleAcceptedDate: req.body.articleAcceptedDate,
            }

        })
        await prisma.$disconnect();
        res.status(201).json({ message: 'Journal Article created successfully', journalArticle })
    }
    catch (err) {
        console.log(err);
        return next(createError(400, 'An error occoured'))
    }

}

export const getAllJournalArticle = async (req, res, next) => {
   
}