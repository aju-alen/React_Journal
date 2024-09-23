import { PrismaClient } from "@prisma/client"
import createError from '../utils/createError.js'
const prisma = new PrismaClient()
import dotenv from 'dotenv'
import stripe from 'stripe';
dotenv.config()


const Stripe = stripe(process.env.STRIPE_SECRET_KEY);


export const createFullIssue = async (req, res, next) => {
    try{
        const {issueVolume,journalId,issuePrice,issueNumber,issueDoccumentURL,issueImageURL,stripeName,stripeDescription} = req.body;
        const fullIssue = await prisma.fullIssue.create({
            data:{
                issueVolume:Number(issueVolume),
                journalId,
                issuePrice,
                issueNumber:Number(issueNumber),
                issueDoccumentURL,
                issueImageURL,
                stripe_lookupId:`vol${issueVolume}Issue${issueNumber}`,
            }
        })
        await prisma.$disconnect();
        res.status(200).json({message:'Full Issue created successfully', fullIssue})

        const product = await Stripe.products.create({
            name: stripeName, // Product name
            description: stripeDescription,
            metadata: {
                type: 'digital', // Flag this as a digital product using metadata
              },
          });

          const price = await Stripe.prices.create({
            unit_amount: issuePrice * 100, 
            currency: 'aed', 
            product: product.id, 
            lookup_key: `vol${issueVolume}Issue${issueNumber}`,
          });

    }
    catch(err){
        console.log(err);
        return next(err)
    }
    

}
export const getSingleFullIssue = async (req, res, next) => {
    try{

        const getIssue = await prisma.fullIssue.findMany({
            select: {
                id: true,
                issueDoccumentURL: true,
                issueImageURL: true,
                issueNumber: true,
                issueVolume: true,
                issuePrice: true,
            },
            orderBy: {
              createdAt: 'asc'
            }
          });
      
        res.status(200).json({message:"Got latest full issue",getIssue})

    }
    catch(err){
        console.log(err);
        return next(err)
    }
    

}

export const findIssue = async (req, res, next) => {
    try{
        const {volume,issue} = req.params;
        const getIssue = await prisma.fullIssue.findMany({
            where:{
                issueVolume:Number(volume),
                issueNumber:Number(issue)
            },
            select: {
                id: true,
                issueDoccumentURL: true,
                issueImageURL: true,
                issueNumber: true,
                issueVolume: true,
                issuePrice: true,
                stripe_lookupId:true
            }
          });
      
        res.status(200).json({message:"Got full issue",getIssue})

    }
    catch(err){
        console.log(err);
        return next(err)
    }
}




