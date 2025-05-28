import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser';
import { errorHandler } from './middleware/errorHandler.js'
import cors from 'cors'
import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import journalRoute from './routes/journal.route.js'
import journalArticleRoute from './routes/journalArticle.route.js'
import fullIssueRoute from './routes/fullIssue.route.js'
import userFullIssueRoute from './routes/userFullIssue.route.js'
import s3Route from './routes/s3.route.js'
import stripeROute from './routes/stripe.route.js'
import subscriptionROute from './routes/subscription.route.js'
import Stripe from 'stripe';
import sendMailRotue from './routes/sendMail.route.js'
import { PrismaClient } from '@prisma/client'
import { originUrl } from './utils/cors.dev.js'
import riseRoutes from './routes/rise-route.js'
const prisma = new PrismaClient()
dotenv.config()


const app = express()
dotenv.config()
app.use(cors({
  origin: originUrl,
})); //frontend url

// http://localhost:5173

//https://react-journal-1.onrender.com

//https://scientificjournalsportal.com

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.FULLISSUE_WEBHOOK_SIG;

app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSession = event.data.object;
      try{
        const {userId, articleId } = checkoutSession.metadata;

        if(checkoutSession.status === 'complete'){
          const invoice = await stripe.invoices.retrieve(checkoutSession.invoice);
      
          console.log("Invoice hosted URL:", invoice.hosted_invoice_url);
          await prisma.userFullIssue.create({
            data:{
              userId:userId,
              fullIssueId:articleId,
              amountTotal:JSON.stringify(checkoutSession.amount_total),
              amountCurrency:checkoutSession.currency,
              payment_intent:checkoutSession.payment_intent,
              invoice_url:invoice.hosted_invoice_url,
            }
          })
      }
      else{
        console.log('checkout session is not complete');
      }
      }
      catch(err){
        console.log(err, 'error in webhook');
      }
      
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      const externalInvoiceData = invoice.lines.data[0]
      if(externalInvoiceData.metadata.purchaseType === 'subscription'){
     try{
        
        if(invoice.status === 'paid') {
          try {
            await prisma.$transaction(async (tx) => {
              const checkUserExist = await tx.subscription.findUnique({
                where: {
                  subscriptionEmail: externalInvoiceData.metadata.emailId
                }
              });

              if(checkUserExist) {
                await tx.subscription.update({
                  where: {
                    subscriptionEmail: externalInvoiceData.metadata.emailId
                  },
                  data: {
                    isSubscribed: true,
                    subscriptionPeriodStart: externalInvoiceData.period.start,
                    subscriptionPeriodEnd: externalInvoiceData.period.end,
                    invoiceId: invoice.id,
                    customerId: invoice.customer,
                    hosted_invoice_url: invoice.hosted_invoice_url,
                    subscriptionAmmount: externalInvoiceData.amount,
                    subscriptionEmail: externalInvoiceData.metadata.emailId,
                    hosted_invoice_pdf: invoice.invoice_pdf,

                  }
                });
              } else {
                await tx.subscription.create({
                  data: {
                    isSubscribed: true,
                    subscriptionEmail: externalInvoiceData.metadata.emailId,
                    subscriptionPeriodStart: externalInvoiceData.period.start,
                    subscriptionPeriodEnd: externalInvoiceData.period.end,
                    invoiceId: invoice.id,
                    customerId: invoice.customer,
                    hosted_invoice_url: invoice.hosted_invoice_url,
                    subscriptionAmmount: externalInvoiceData.amount,
                    subscriptionEmail: externalInvoiceData.metadata.emailId,
                    hosted_invoice_pdf: invoice.invoice_pdf,
                  }
                });
              }
            });

            console.log('Transaction completed successfully');
          } catch (error) {
            console.error('Transaction failed:', error);
            throw error; // Re-throw to handle it in the webhook handler
          }
        }
      }
      catch(err){
        console.log(err,'This is the error in invoice payment succeeded');
      }}


      // Handle successful payment
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});





app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/journal', journalRoute)
app.use('/api/journalArticle', journalArticleRoute)
app.use('/api/s3', s3Route)
app.use('/api/fullIssue', fullIssueRoute)
app.use('/api/stripe', stripeROute)
app.use('/api/send-email', sendMailRotue)
app.use('/api/user-fullissue', userFullIssueRoute)
app.use('/api/subscription', subscriptionROute)

app.use('/api/rise',riseRoutes)


app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {

  console.log(`server listening at port ${PORT}`);
})
