import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middleware/errorHandler.js'
import cors from 'cors'
import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import journalRoute from './routes/journal.route.js'
import journalArticleRoute from './routes/journalArticle.route.js'
import s3Route from './routes/s3.route.js'
import stripeROute from './routes/stripe.route.js'
import stripe from 'stripe';
import bodyParser from 'body-parser';
dotenv.config()

const Stripe = stripe('sk_test_51OmAAaC0iMczP50IWaK8VezGqqjCwy1QOWMx1jDkscHuJ8bwHHiXImfcJKJna5gSE555YoQBSd59KPK7AD8YFtI000EnfSvhPZ');
const YOUR_DOMAIN = 'http://localhost:3001';
const endpointSecret = 'whsec_...';
const fulfillOrder = (lineItems) => {
  // TODO: fill me in
  console.log("Fulfilling order", lineItems);
}

const app = express()
dotenv.config()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authRoute)
app.use('/api/users',userRoute)
app.use('/api/journal',journalRoute)
app.use('/api/journalArticle',journalArticleRoute)
app.use('/api/s3',s3Route)
app.use('/create-checkout-session',stripeROute)
app.post('/webhook', bodyParser.raw({type: 'application/json'}), async (request, response) => {
  const payload = request.body;
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ['line_items'],
      }
    );
    const lineItems = sessionWithLineItems.line_items;

    // Fulfill the purchase...
    fulfillOrder(lineItems);
  }

  response.status(200).end();
});


app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{

    console.log(`server listening at port ${PORT}`);
})
