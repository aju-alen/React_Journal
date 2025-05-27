import stripe from 'stripe';
import { stripeDomain } from '../utils/cors.dev.js';
import dotenv from 'dotenv'
dotenv.config()


const Stripe = stripe(process.env.STRIPE_SECRET_KEY);
const YOUR_DOMAIN = stripeDomain;
// const YOUR_DOMAIN = 'http://localhost:5173';
// const YOUR_DOMAIN = 'https://scientificjournalsportal.com';


// export const createCheckoutSession = async (req, res, next) => {
//   let price;
//   let {articleId,checkoutStatus,userId,emailId,stripeLookupId} = req.body;
//   console.log(checkoutStatus,articleId, 'checkoutStatus in api');
//   if (checkoutStatus === "publisharticle" ){
//     price = process.env.STRIPE_PUBLISH_ARTICLE_PRICEID
//   }
//   else if (checkoutStatus === "fullIssue"){
//     const prices = await Stripe.prices.list({
//       lookup_keys: [`${stripeLookupId}`],
//     });

//      price = prices.data[0]?.id;
//   }
//   try{
//     console.log(price, 'price in stripe');
//     const session = await Stripe.checkout.sessions.create({
//       ui_mode: 'embedded',
//       customer_email: emailId,
//       line_items: [
//         {
          
//           price: price,
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       metadata:{
//         articleId:articleId,
//         checkoutStatus:checkoutStatus,
//         userId:userId
//       },
//       return_url: `${YOUR_DOMAIN}/returnPayment?session_id={CHECKOUT_SESSION_ID}`,
//     });
//     console.log(session, 'session in api');
  
//     res.send({clientSecret: session.client_secret});
//   }
//   catch(err){
//     console.log(err, 'error in stripe');
//     res.status(500).send({error: err.message});
//   }
  
  
// };

export const returnSessionStatus = async (req, res, next) => {
  const session = await Stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
};

export const createCheckoutSessionForSubscription = async (req, res, next) => {
  console.log('Creating checkout session with metadata:', {
    userId: req.body.userId,
    emailId: req.body.emailId
  });

  const prices = await Stripe.prices.list({
    lookup_keys: [req.body.lookup_key],
    expand: ['data.product'],
  });

  const session = await Stripe.checkout.sessions.create({
    
    subscription_data: {
      metadata: {
        userId: req.body.userId,
        emailId: req.body.emailId
      },
    },
    billing_address_collection: 'auto',
    customer_email: req.body.emailId,
    line_items: [
      {
        price: prices.data[0].id,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${YOUR_DOMAIN}/productDisplay/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  // Log the created session to verify metadata
  console.log('Created session with metadata:', session.metadata);
  
  res.redirect(303, session.url);
}

export const createPortalSessionForSubscription = async (req, res, next) => {
 // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const { session_id } = req.body;
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = YOUR_DOMAIN;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  res.redirect(303, portalSession.url);
}