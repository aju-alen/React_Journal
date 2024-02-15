
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
export const deleteUser = async (req, res, next) => {
   
}

   
