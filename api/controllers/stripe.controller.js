import dotenv from 'dotenv'
import stripe from 'stripe';
dotenv.config()

const Stripe = stripe('sk_test_51OmAAaC0iMczP50IWaK8VezGqqjCwy1QOWMx1jDkscHuJ8bwHHiXImfcJKJna5gSE555YoQBSd59KPK7AD8YFtI000EnfSvhPZ');
const YOUR_DOMAIN = 'http://localhost:3001';


export const createCheckoutSession = async (req, res, next) => {
  const session = await Stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1OmAyCC0iMczP50IFuEamjs3',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:5173/success',
    cancel_url: 'http://localhost:5173/cancel',
  });
  console.log(session.completed, 'session');
  res.redirect(303, session.url);
}

