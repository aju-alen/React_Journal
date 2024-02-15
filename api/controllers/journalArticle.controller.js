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
                articleAuthor: req.body.authors

            }

        })
        // const articleAuthor = await prisma.author.create({
        //     data: req.body.authors,articleId:1
        // })

        await prisma.$disconnect();
        res.status(201).json({ message: 'Journal Article created successfully', journalArticle, articleAuthor})
    }
    catch (err) {
        console.log(err);
        return next(createError(400, 'An error occoured'))
    }

}

export const getAllJournalArticle = async (req, res, next) => {
    try {
        const journalArticle = await prisma.article.findUnique({
            where: { id: 1 },
            include: {
                userId: true,
                journalId: true,
                authors: true
            }
        });
        console.log(journalArticle);
        return journalArticle;
    }
    catch (err) {
        console.log(err);
        return next(createError(400, 'An error occurred'));
        
    }
    
   
}