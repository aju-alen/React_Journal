import { PrismaClient } from "@prisma/client"
import createError from '../utils/createError.js'
const prisma = new PrismaClient()


export const getFullIssuePurchasedUser = async (req, res, next) => {
    console.log(req.userId, 'req.userId ');
    try{
        const fullIssuePurchasedUser = await prisma.userFullIssue.findMany({
            where: {
              userId: req.userId, // Filter by userId
            },
            include: {
              fullIssue: true, // Include related FullIssue data
            },
          });
      
        res.status(200).json({message:'Full Issue Purchased User',fullIssuePurchasedUser})

    }
    catch(err){
        console.log(err);
        return next(err)
    }
    

}





