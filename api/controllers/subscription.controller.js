import { PrismaClient } from "@prisma/client"
import createError from '../utils/createError.js'
const prisma = new PrismaClient()


export const getSubscriptionDetails = async (req, res, next) => {
    console.log(req.params, 'req.params');
    try{
        const getSubscription = await prisma.subscription.findFirst({
            where: {
                subscriptionEmail: req.params.emailId // assuming req.params.emailId contains the email
            }
        });
        
        if (!getSubscription) {
            await prisma.$disconnect();
            // If getSubscription is null (no subscription found), return null or handle the scenario accordingly
            res.status(200).json({message:'This user has not subscribed',getSubscription:null}) // or any action you want to take if the subscription doesn't exist
        }
        else{
            res.status(200).json({message:'User Subscription Details', getSubscription})

        }
        

    }
    catch(err){
        console.log(err);
        return next(err)
    }
    

}


