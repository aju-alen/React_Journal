import { PrismaClient } from "@prisma/client"
import createError from '../utils/createError.js'
const prisma = new PrismaClient()


export const createJournalArticle = async (req, res, next) => {
    console.log(req.body.authors);
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