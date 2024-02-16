
import jwt from 'jsonwebtoken'
import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()
export const getOneUser = async (req, res, next) => {
   try{
         const profileId = req.params.profileId
         const user = await prisma.user.findUnique({
            where:{
                  id:Number(profileId)
            }
         })
         if(!user){
            res.status(404).send('User not found')
         }
         res.status(200).json(user)
   }
   catch(err){
       console.log(err);
       res.status(400).send('An error occoured')
   }
}
export const getUserWithArticles = async (req, res, next) => {
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

   
