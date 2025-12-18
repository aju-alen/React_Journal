
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
      success_url: `${process.env.FRONTEND_RISE_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_RISE_URL || 'http://localhost:5173'}/payment/cancelled?canceled=true`,
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

import { PrismaClient } from '@prisma/client';
import { resendEmailBoiler } from '../utils/resend-email-boiler.js';
import { riseInvestmentConfirmationTemplate } from '../utils/emailTemplates.js';
const prisma = new PrismaClient();

/**
 * Handle Stripe webhook for payment confirmation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const handleRiseWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const riseEndpointSecret = process.env.RISE_WEBHOOK_SIG;

  // Verify signature header exists
  if (!sig) {
    console.error('Rise Webhook Error: Missing stripe-signature header');
    return res.status(400).send('Missing stripe-signature header');
  }

  // Verify endpoint secret is configured
  if (!riseEndpointSecret) {
    console.error('Rise Webhook Error: Webhook signing secret is not configured');
    return res.status(500).send('Webhook configuration error');
  }

  // Verify request body is a Buffer (required for signature verification)
  if (!req.body || !Buffer.isBuffer(req.body)) {
    console.error('Rise Webhook Error: Request body is not a Buffer. Body type:', typeof req.body);
    return res.status(400).send('Invalid request body format - body must be raw Buffer');
  }

  let event;

  try {
    // request.body must be a Buffer for signature verification
    event = stripe.webhooks.constructEvent(req.body, sig, riseEndpointSecret);
    console.log('Rise Webhook signature verified successfully. Event type:', event.type);
  } catch (err) {
    console.error('Rise Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSession = event.data.object;
      try {
        if (checkoutSession.status === 'complete') {
          const { investor_name, investor_email } = checkoutSession.metadata;

          if (!investor_email) {
            console.error('Rise Webhook Error: Missing investor_email in metadata');
            break;
          }

          // Retrieve invoice to get receipt URL
          let receiptUrl = '';
          if (checkoutSession.invoice) {
            try {
              const invoice = await stripe.invoices.retrieve(checkoutSession.invoice);
              receiptUrl = invoice.hosted_invoice_url || '';
            } catch (invoiceError) {
              console.error('Rise Webhook Error: Failed to retrieve invoice:', invoiceError);
            }
          }



          if (investor_email) {
            await prisma.riseInvestor.create({
              data: {
                name: investor_name || investor_email,
                email: investor_email,
                receipt_url: receiptUrl
              }
            });
            console.log('Rise Investor created successfully:', investor_email);

            // Send confirmation email to investor
            try {
              const emailHtml = riseInvestmentConfirmationTemplate(
                investor_name || investor_email,
                investor_email,
                receiptUrl
              );
              
              await resendEmailBoiler(
                process.env.RISE_INVESTOR_AUTH_USER || process.env.GMAIL_AUTH_USER,
                investor_email,
                'Investment Confirmation - RISE',
                emailHtml
              );
              
              console.log('Investment confirmation email sent to:', investor_email);
            } catch (emailError) {
              console.error('Rise Webhook Error: Failed to send confirmation email:', emailError);
              // Don't throw - email failure shouldn't break the webhook
            }
          } else {
            console.log('Rise Investor already exists:', investor_email);
          }
        } else {
          console.log('Rise checkout session is not complete');
        }
      } catch (err) {
        console.error('Rise Webhook Error in checkout.session.completed:', err);
      }
      break;

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      try {
        // Get customer email from payment intent
        let customerEmail = '';
        let customerName = '';

        if (paymentIntent.customer) {
          try {
            const customer = await stripe.customers.retrieve(paymentIntent.customer);
            customerEmail = customer.email || '';
            customerName = customer.name || customerEmail;
          } catch (customerError) {
            console.error('Rise Webhook Error: Failed to retrieve customer:', customerError);
          }
        }

        // Try to get email from billing details
        if (!customerEmail && paymentIntent.charges && paymentIntent.charges.data && paymentIntent.charges.data.length > 0) {
          customerEmail = paymentIntent.charges.data[0].billing_details?.email || '';
          customerName = paymentIntent.charges.data[0].billing_details?.name || customerEmail;
        }

        // Try to get from metadata
        if (!customerEmail && paymentIntent.metadata && paymentIntent.metadata.investor_email) {
          customerEmail = paymentIntent.metadata.investor_email;
          customerName = paymentIntent.metadata.investor_name || customerEmail;
        }

        if (!customerEmail) {
          console.error('Rise Webhook Error: Could not determine customer email from payment_intent');
          break;
        }

        // Retrieve receipt URL - try to get from checkout session if available
        let receiptUrl = '';
        if (paymentIntent.metadata && paymentIntent.metadata.checkout_session_id) {
          try {
            const session = await stripe.checkout.sessions.retrieve(paymentIntent.metadata.checkout_session_id);
            if (session.invoice) {
              const invoice = await stripe.invoices.retrieve(session.invoice);
              receiptUrl = invoice.hosted_invoice_url || '';
            }
          } catch (sessionError) {
            console.error('Rise Webhook Error: Failed to retrieve checkout session:', sessionError);
          }
        }

        // Check for existing record to prevent duplicates
        const existingInvestorPayment = await prisma.riseInvestor.findFirst({
          where: {
            email: customerEmail
          }
        });

        if (!existingInvestorPayment) {
          await prisma.riseInvestor.create({
            data: {
              name: customerName || customerEmail,
              email: customerEmail,
              receipt_url: receiptUrl
            }
          });
          console.log('Rise Investor created from payment_intent:', customerEmail);

          // Send confirmation email to investor
          try {
            const emailHtml = riseInvestmentConfirmationTemplate(
              customerName || customerEmail,
              customerEmail,
              receiptUrl
            );
            
            await resendEmailBoiler(
              process.env.RISE_AUTH_USER || process.env.GMAIL_AUTH_USER,
              customerEmail,
              'Investment Confirmation - RISE',
              emailHtml
            );
            
            console.log('Investment confirmation email sent to:', customerEmail);
          } catch (emailError) {
            console.error('Rise Webhook Error: Failed to send confirmation email:', emailError);
            // Don't throw - email failure shouldn't break the webhook
          }
        } else {
          console.log('Rise Investor already exists from payment_intent:', customerEmail);
        }
      } catch (err) {
        console.error('Rise Webhook Error in payment_intent.succeeded:', err);
      }
      break;

    default:
      console.log(`Rise Webhook: Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};