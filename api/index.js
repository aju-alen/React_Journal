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
import stripe from 'stripe';
import sendMailRotue from './routes/sendMail.route.js'
import { PrismaClient } from '@prisma/client'
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

app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;
  console.log('Logged into webhook route for publish journal ');

  try {
    event = Stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log(event, 'event in stripe route webhook');
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  let subscription;
  let status;
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

      const checkoutSessionCompleted = event.data.object;
      console.log(checkoutSessionCompleted, 'checkoutSessionCompleted in stripe route webhookkkkkkkkkk');

      if (checkoutSessionCompleted.payment_status === 'paid' && checkoutSessionCompleted.status === 'complete' && checkoutSessionCompleted.mode === 'payment' && checkoutSessionCompleted.metadata.checkoutStatus === 'publisharticle') {
        const payment = await prisma.article.update({
          where: { id: checkoutSessionCompleted.metadata.articleId },
          data: {
            paymentStatus: true
          }
        })
        await prisma.$disconnect();
        // console.log(payment, 'payment in stripe route webhook');
      }
      if (checkoutSessionCompleted.payment_status === 'paid' && checkoutSessionCompleted.status === 'complete' && checkoutSessionCompleted.mode === 'payment' && checkoutSessionCompleted.metadata.checkoutStatus === 'fullIssue') {

        const userFullIssue = await prisma.userFullIssue.create({
          data: {
            userId: checkoutSessionCompleted.metadata.userId,
            fullIssueId: checkoutSessionCompleted.metadata.articleId
          }
        });
        console.log(userFullIssue, 'user schema in database');

        await prisma.$disconnect();
        // console.log(payment, 'payment in stripe route webhook');
      }
      if(checkoutSessionCompleted.mode === 'subscription'){
        console.log(checkoutSessionCompleted.invoice, 'checkoutSessionCompleted.invoice');
        const subscription = await prisma.subscription.update({

          where: { invoiceId: checkoutSessionCompleted.invoice },
          data:{
            userId: checkoutSessionCompleted.metadata.userId,
          }
        });
          await prisma.$disconnect();
          console.log(subscription, 'subscription find in databaseeeee');
      }
      // Then define and call a function to handle the event checkout.session.completed
      break;

      case 'customer.created':
        const customerCreated = event.data.object;
        console.log(customerCreated, 'customer created event in webhook');
        // Then define and call a function to handle the event customer.created
        break;

    case 'invoice.created':
      // Then define and call a function to handle the event invoice.created
      const invoiceCreated = event.data.object;
      console.log(invoiceCreated, 'invoice created in stripe route webhook');
      break;
    case 'invoice.payment_succeeded':
      // Then define and call a function to handle the event invoice.payment_succeeded
      const invoicePaymentSucceeded = event.data.object;
      // console.log(invoicePaymentSucceeded, 'invoice payment succeeded in stripe route webhook');

      const subscription = await prisma.subscription.create({
        data:{
          isSubscribed : true,
          subscriptionAmmount : invoicePaymentSucceeded.amount_paid,
          subscriptionPeriodStart : invoicePaymentSucceeded.period_start,
          subscriptionPeriodEnd : invoicePaymentSucceeded.period_end,
          subscriptionEmail : invoicePaymentSucceeded.customer_email,
          hosted_invoice_url : invoicePaymentSucceeded.hosted_invoice_url,
          hosted_invoice_pdf : invoicePaymentSucceeded.invoice_pdf,
          invoiceId : invoicePaymentSucceeded.id,
          customerId : invoicePaymentSucceeded.subscription
        }


      })
     
     
      break;
    case 'customer.subscription.trial_will_end':
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription trial ending.
      // handleSubscriptionTrialEnding(subscription);
      break;
    case 'customer.subscription.deleted':
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription deleted.
      // handleSubscriptionDeleted(subscriptionDeleted);
      break;
    case 'customer.subscription.created':
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription created.
      // handleSubscriptionCreated(subscription);
      break;
    case 'customer.subscription.updated':
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription update.
      // handleSubscriptionUpdated(subscription);
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



app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {

  console.log(`server listening at port ${PORT}`);
})
