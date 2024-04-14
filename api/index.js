import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middleware/errorHandler.js'
import cors from 'cors'
import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import journalRoute from './routes/journal.route.js'
import journalArticleRoute from './routes/journalArticle.route.js'
import fullIssueRoute from './routes/fullIssue.route.js'
import s3Route from './routes/s3.route.js'
import stripeROute from './routes/stripe.route.js'
import stripe from 'stripe';
import sendMailRotue from './routes/sendMail.route.js'
import {PrismaClient} from '@prisma/client'
import { originUrl } from './utils/cors.dev.js'
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


const endpointSecret = process.env.PUBLISH_JOURNAL_WEBHOOK_SIG;
const Stripe = stripe(process.env.STRIPE_SECRET_KEY);

app.post('/webhook', express.raw({type: 'application/json'}), async(request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;
  console.log('Logged into webhook route for publish journal ');

  try {
    event = Stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.async_payment_failed':
      const checkoutSessionAsyncPaymentFailed = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      console.log('1');
      break;
    case 'checkout.session.async_payment_succeeded':
      console.log('2');
      const checkoutSessionAsyncPaymentSucceeded = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
     
      break;
    case 'checkout.session.completed':
      console.log('3');
      console.log(event.data.object.payment_status, 'payment status in stripe route webhook');
      console.log(event.data.object.status, 'status in stripe route webhook');
      const checkoutSessionCompleted = event.data.object;
      if (event.data.object.payment_status === 'paid' && event.data.object.status === 'complete' && event.data.object.mode === 'payment') {
        const payment = await prisma.article.update({
          where:{id:event.data.object.metadata.articleId},
          data:{
            paymentStatus:true
          }
        })
        await prisma.$disconnect();
        console.log(payment, 'payment in stripe route webhook');
      }
      
      // Then define and call a function to handle the event checkout.session.completed
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

// -----------------------FullIssue Payment Webhook

const fullIssueWebhook = process.env.FULLISSUE_WEBHOOK_SIG;
app.post('/fullissue', express.raw({type: 'application/json'}), async(request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;
  console.log('Logged into webhook route',event);

  try {
    event = Stripe.webhooks.constructEvent(request.body, sig, fullIssueWebhook);

  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.async_payment_failed':
      const checkoutSessionAsyncPaymentFailed = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      break;
    case 'checkout.session.async_payment_succeeded':
      console.log("checkout session async payment succeeded for full issue");
      const checkoutSessionAsyncPaymentSucceeded = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      break;
    case 'checkout.session.completed':
      console.log("checkout session completed for full issue");
      const checkoutSessionCompleted = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});




app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/journal', journalRoute)
app.use('/api/journalArticle', journalArticleRoute)
app.use('/api/s3', s3Route)
app.use('/api/fullIssue',fullIssueRoute )
app.use('/api/stripe', stripeROute)
app.use('/api/send-email', sendMailRotue)



app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {

  console.log(`server listening at port ${PORT}`);
})
