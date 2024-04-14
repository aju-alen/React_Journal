import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()


export const createFullIssue = async (req, res, next) => {
    try{
        const {issueVolume,journalId,issuePrice,issueNumber,issueDoccumentURL,issueImageURL} = req.body;
        const fullIssue = await prisma.fullIssue.create({
            data:{
                issueVolume:Number(issueVolume),
                journalId,
                issuePrice,
                issueNumber:Number(issueNumber),
                issueDoccumentURL,
                issueImageURL
            }
        })
        await prisma.$disconnect();
        res.status(200).json({message:'Full Issue created successfully', fullIssue})

    }
    catch(err){
        console.log(err);
        return next(err)
    }
    

}
export const getFullIssue = async (req, res, next) => {
    try{

        const getIssue = await prisma.fullIssue.findMany({
            take:1,
            orderBy:{
                createdAt:'desc'
            }  
        })
      
        res.status(200).json({message:"Got latest full issue",getIssue})

    }
    catch(err){
        console.log(err);
        return next(err)
    }
    

}




