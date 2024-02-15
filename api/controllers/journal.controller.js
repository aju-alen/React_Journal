import { PrismaClient } from "@prisma/client"
import createError from '../utils/createError.js'
const prisma = new PrismaClient()


export const createJournal = async (req, res, next) => {
    try {
        const journal = await prisma.jounral.create({
            data: {
                journalTitle: req.body.journalTitle,
                journalImageURL: req.body.journalImageURL,
                journalAbbreviation: req.body.journalAbbreviation,
                journalLanguage: req.body.journalLanguage,
                journalISSN: req.body.journalISSN,
                journalDOI: req.body.journalDOI,
                journalStartYear: req.body.journalStartYear,
            }
        })
        await prisma.$disconnect();
        res.status(201).json({ message: 'Journal created successfully', journal })
    }
    catch (err) {
        console.log(err);
        return next(createError(400, 'An error occoured'))
    }

}

export const getAllJournal = async (req, res, next) => {
    try {
        const journal = await prisma.jounral.findMany()
        await prisma.$disconnect();
        res.status(200).json(  journal )
    }
    catch (err) {
        console.log(err);
        return next(createError(400, 'An error occoured'))
    }
}

export const getAllJournalCategoryName = async (req, res, next) => {
    try {
        const journal = await prisma.jounral.findMany({
            select: {
                id: true,
                journalTitle: true
            }
        })
        await prisma.$disconnect();
        res.status(200).json( journal )
    }
    catch (err) {
        console.log(err);
        return next(createError(400, 'An error occoured'))
    }
}

