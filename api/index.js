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
import { resendEmailBoiler } from './utils/resend-email-boiler.js'
import { subscriptionPaymentSuccessfulEmailTemplate } from './utils/emailTemplates.js'
import { handleRiseWebhook } from './controllers/rise-controller.js'
const prisma = new PrismaClient()
dotenv.config()


const app = express()
dotenv.config()

// IMPORTANT: Webhook route MUST be defined before CORS and any body parsing middleware
// This ensures the raw request body is preserved for Stripe signature verification

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.FULLISSUE_WEBHOOK_SIG;
const riseStripe = Stripe(process.env.STRIPE_SECRET_KEY_RISE);
const riseEndpointSecret = process.env.RISE_WEBHOOK_SIG;

// CRITICAL: Webhook route MUST be defined before any body parsing middleware
// Use bodyParser.raw() to ensure raw body is preserved as Buffer for signature verification
// In production, ensure your reverse proxy (nginx, etc.) doesn't parse the body for this endpoint
app.post('/rise/webhook',
  bodyParser.raw({ type: 'application/json' }),
  handleRiseWebhook
);

app.post('/webhook', 
  bodyParser.raw({ type: 'application/json' }), 
  async (request, response) => {
    const sig = request.headers['stripe-signature'];

    // Verify signature header exists
    if (!sig) {
      console.error('Webhook Error: Missing stripe-signature header');
      return response.status(400).send('Missing stripe-signature header');
    }

    // Verify endpoint secret is configured
    if (!endpointSecret) {
      console.error('Webhook Error: Webhook signing secret is not configured');
      return response.status(500).send('Webhook configuration error');
    }

    // Verify request body is a Buffer (required for signature verification)
    if (!request.body || !Buffer.isBuffer(request.body)) {
      console.error('Webhook Error: Request body is not a Buffer. Body type:', typeof request.body);
      console.error('Body is parsed:', typeof request.body === 'object' && !Buffer.isBuffer(request.body));
      return response.status(400).send('Invalid request body format - body must be raw Buffer');
    }

    // Debug logging (first 10 chars of secret to verify it's loaded, without exposing full secret)
    console.log('Webhook Debug Info:');
    console.log('- Endpoint secret configured:', !!endpointSecret);
    console.log('- Endpoint secret prefix:', endpointSecret ? endpointSecret.substring(0, 10) + '...' : 'NOT SET');
    console.log('- Signature header present:', !!sig);
    console.log('- Body is Buffer:', Buffer.isBuffer(request.body));
    console.log('- Body length:', request.body?.length);
    console.log('- Request Content-Type:', request.headers['content-type']);
    console.log('- Request method:', request.method);
    console.log('- Request URL:', request.url);

    let event;

    try {
      // request.body must be a Buffer for signature verification
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log('Webhook signature verified successfully. Event type:', event.type);
    } catch (err) {
      console.error('Webhook Error:', err.message);
      console.error('Detailed Debug Info:');
      console.error('- Signature header present:', !!sig);
      console.error('- Signature header value (first 20 chars):', sig ? sig.substring(0, 20) + '...' : 'MISSING');
      console.error('- Body type:', typeof request.body);
      console.error('Body is Buffer:', Buffer.isBuffer(request.body));
      console.error('- Body length:', request.body?.length);
      console.error('- Endpoint secret prefix:', endpointSecret ? endpointSecret.substring(0, 10) + '...' : 'NOT SET');
      console.error('- Error type:', err.type);
      console.error('- Full error:', err);
      
      // Additional check: Try to parse signature to see if it's valid format
      if (sig) {
        const sigParts = sig.split(',');
        console.error('- Signature parts count:', sigParts.length);
        sigParts.forEach((part, idx) => {
          const [key, value] = part.split('=');
          console.error(`  Part ${idx}: ${key} = ${value ? value.substring(0, 20) + '...' : 'empty'}`);
        });
      }
      
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

            //send email to user
            const user = await prisma.user.findUnique({
              where: {
                email: externalInvoiceData.metadata.emailId
              }
            });
            if(user){
              // Format dates from Unix timestamps to readable format
              const formatDate = (timestamp) => {
                const date = new Date(timestamp * 1000);
                return date.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                });
              };

              // Format amount from cents to currency
              const formatAmount = (amount, currency = 'aed') => {
                const amountInDollars = (amount / 100).toFixed(2);
                const currencySymbol = currency.toUpperCase() === 'AED' ? 'AED' : currency.toUpperCase();
                return `${currencySymbol}${amountInDollars}`;
              };

              const subscriptionPeriodStart = formatDate(externalInvoiceData.period.start);
              const subscriptionPeriodEnd = formatDate(externalInvoiceData.period.end);
              const subscriptionAmount = formatAmount(externalInvoiceData.amount, invoice.currency);
              const userName = user.surname || user.name || 'Valued Customer';

              const emailHtml = subscriptionPaymentSuccessfulEmailTemplate(
                userName,
                subscriptionPeriodStart,
                subscriptionPeriodEnd,
                invoice.hosted_invoice_url,
                invoice.invoice_pdf,
                subscriptionAmount
              );

              await resendEmailBoiler(
                process.env.GMAIL_AUTH_USER,
                user.email,
                'Subscription Payment Successful',
                emailHtml
              )
            }

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

// Apply CORS and body parsing middleware AFTER webhook route
// This ensures webhook receives raw body
app.use(cors({
  origin: originUrl,
})); //frontend url

// http://localhost:5173
//https://react-journal-1.onrender.com
//https://scientificjournalsportal.com

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
