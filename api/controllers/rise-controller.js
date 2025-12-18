
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

export const sendContact = async (req, res, next) => {
    const { name, email, phone, message } = req.body;
    console.log(name, email, phone, message);
    
    try{
        sendVerificationEmail(name,email,phone,message);
        res.status(200).json({message: "Email sent successfully"});        
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

const createTransport = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.RISE_AUTH_USER,
        pass: process.env.RISE_AUTH_PASS
    }
})

const sendVerificationEmail = async (name,email,phone,message) => {
 

    const transporter = createTransport;
    console.log(transporter, 'transporter');
    const mailOptions = {
        from: process.env.RISE_AUTH_USER,
        to: process.env.RISE_AUTH_USER,
        subject: 'New Contact Request',
        html: `
<html>
<body>
    <div>

       
        <p>New Rise Form</p>

    </div>
    <div>
        <p>Hi ${name},</p>
        <p>You got a new form</p>
        <br>
        <p>
        Name: ${name}
        </p>
        <p>
        Email: ${email}
        </p>
        <p>
        Phone Number: ${phone}
        </p>
        <p>
        Message: ${message}        
        </p>
        <br>
    </div>
</body>
</html>`
    }

    //send the mail
    try {
        const response = await transporter.sendMail(mailOptions);
        console.log("Verification email sent", response);
    }
    catch (err) {
        console.log("Err sending verification email", err);
    }
}

import Stripe from 'stripe';

// Initialize Stripe with secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_RISE);

// Helper function to format amount for display
const formatAmount = (amount) => {
  if (amount >= 1000000) {
    const millions = amount / 1000000;
    return millions % 1 === 0 ? `${millions}M AED` : `${millions.toFixed(1)}M AED`;
  } else if (amount >= 1000) {
    const thousands = amount / 1000;
    return thousands % 1 === 0 ? `${thousands}K AED` : `${thousands.toFixed(1)}K AED`;
  }
  return `${amount} AED`;
};

/**
 * Create Stripe Checkout Session for investment tier
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createCheckoutSession = async (req, res, next) => {
  try {
    const { amount, name, email, phone, tierAmount } = req.body;

    // Validate required fields
    if (!amount || !email) {
      return res.status(400).json({ 
        message: 'Amount and email are required' 
      });
    }

    // Convert AED to fils (1 AED = 100 fils)
    // Stripe requires amounts in the smallest currency unit
    const amountInFils = Math.round(amount * 100);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aed', // AED is supported by Stripe
            product_data: {
              name: `Investment Tier - ${tierAmount || formatAmount(amount)}`,
              description: `Investment opportunity at ${tierAmount || formatAmount(amount)} tier`,
            },
            unit_amount: amountInFils, // Amount in fils
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_RISE_URL || 'http://localhost:5173'}/investors?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_RISE_URL || 'http://localhost:5173'}/investors?canceled=true`,
      customer_email: email,
      metadata: {
        investor_name: name || '',
        investor_email: email,
        investor_phone: phone || '',
        tier_amount: tierAmount || amount,
      },
    });

    res.status(200).json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    res.status(500).json({ 
      message: 'Failed to create checkout session',
      error: error.message 
    });
  }
};

/**
 * Handle Stripe webhook for payment confirmation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */