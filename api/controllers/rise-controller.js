
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
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

import { resendEmailBoilerRise } from '../utils/resend-email-boiler.js';
import { riseInvestmentConfirmationTemplate } from '../utils/emailTemplates.js';

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

          // Retrieve receipt URL - try invoice first, then payment intent charge
          let receiptUrl = '';
          
          // For subscription payments, invoice is available
          if (checkoutSession.invoice) {
            try {
              const invoice = await stripe.invoices.retrieve(checkoutSession.invoice);
              receiptUrl = invoice.hosted_invoice_url || '';
            } catch (invoiceError) {
              console.error('Rise Webhook Error: Failed to retrieve invoice:', invoiceError);
            }
          } 
          // For one-time payments, get receipt from payment intent charge
          else if (checkoutSession.payment_intent) {
            try {
              const paymentIntent = await stripe.paymentIntents.retrieve(checkoutSession.payment_intent);
              
              // Get the charge from payment intent
              if (paymentIntent.latest_charge) {
                const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
                receiptUrl = charge.receipt_url || '';
              } else if (paymentIntent.charges && paymentIntent.charges.data && paymentIntent.charges.data.length > 0) {
                // Fallback: get first charge if latest_charge is not available
                receiptUrl = paymentIntent.charges.data[0].receipt_url || '';
              }
            } catch (paymentError) {
              console.error('Rise Webhook Error: Failed to retrieve payment intent receipt:', paymentError);
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
                receiptUrl,
              );
              
              await resendEmailBoilerRise(
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
            console.log(session, 'session');
            if (session.invoice) {
              const invoice = await stripe.invoices.retrieve(session.invoice);
              receiptUrl = invoice.hosted_invoice_url || '';
              console.log(invoice, 'invoice');
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
            
            await resendEmailBoilerRise(
              process.env.RISE_INVESTOR_AUTH_USER || process.env.GMAIL_AUTH_USER,
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

/**
 * Generate a 4-digit OTP
 * @returns {string} 4-digit OTP
 */
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * OTP email template
 * @param {string} name - User's name
 * @param {string} otp - 4-digit OTP
 * @param {string} reportType - 'profile' or 'report'
 * @returns {string} HTML email template
 */
const otpEmailTemplate = (name, otp, reportType) => {
  const reportName = reportType === 'profile' ? 'Profile' : reportType === 'investor' ? 'Investment Opportunities' : 'Report';
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification - RISE</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.7;
          color: #1a202c;
          background-color: #ffffff;
        }
        .email-wrapper {
          background-color: #ffffff;
          padding: 40px 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          background-color: #2A3C5A;
          padding: 50px 30px;
          text-align: center;
        }
        .header-title {
          color: #ffffff;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-top: 15px;
          text-transform: uppercase;
        }
        .content {
          padding: 40px 30px;
          background-color: #ffffff;
        }
        .greeting {
          font-size: 24px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 20px;
        }
        .message-text {
          font-size: 16px;
          color: #1a202c;
          margin-bottom: 16px;
          line-height: 1.8;
        }
        .otp-box {
          background-color: #f7fafc;
          border: 3px solid #2A3C5A;
          border-radius: 12px;
          padding: 30px;
          margin: 30px 0;
          text-align: center;
        }
        .otp-label {
          font-size: 14px;
          color: #4a5568;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .otp-code {
          font-size: 48px;
          font-weight: 800;
          color: #2A3C5A;
          letter-spacing: 8px;
          font-family: 'Courier New', monospace;
        }
        .info-box {
          background-color: #fff9e6;
          border: 1px solid #f6e05e;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
        }
        .info-text {
          font-size: 14px;
          color: #744210;
          line-height: 1.7;
        }
        .footer {
          background-color: #ffffff;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-text {
          font-size: 13px;
          color: #4a5568;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-container">
          <div class="header">
            <h1 class="header-title">RISE</h1>
          </div>
          <div class="content">
            <p class="greeting">Hi ${name},</p>
            <p class="message-text">
              Thank you for requesting the ${reportName}. Please use the OTP below to verify your email and access your ${reportName}.
            </p>
            <div class="otp-box">
              <p class="otp-label">Your Verification Code</p>
              <p class="otp-code">${otp}</p>
            </div>
            <div class="info-box">
              <p class="info-text">
                ⚠️ This OTP is valid for 10 minutes. Please do not share this code with anyone.
              </p>
            </div>
            <p class="message-text">
              Enter this code in the verification form to complete your request.
            </p>
          </div>
          <div class="footer">
            <p class="footer-text">
              This is an automated email from RISE (Right Intellectual Services Enterprise).
            </p>
            <p class="footer-text">
              If you did not request this ${reportName}, please ignore this email.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Submit profile request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const submitProfileRequest = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ 
        message: 'Name and email are required' 
      });
    }

    // Generate 4-digit OTP
    const otp = generateOTP();

    // Store in database
    const profileRequest = await prisma.profileReport.create({
      data: {
        name,
        email,
        report: 'profile',
        otp,
        isEmailVerified: false
      }
    });

    // Send OTP email
    try {
      const emailHtml = otpEmailTemplate(name, otp, 'profile');
      await resendEmailBoilerRise(
        process.env.RISE_INVESTOR_AUTH_USER || process.env.GMAIL_AUTH_USER,
        email,
        'OTP Verification - RISE Profile Request',
        emailHtml
      );
      console.log('OTP email sent to:', email);
    } catch (emailError) {
      console.error('Error sending OTP email:', emailError);
      // Don't fail the request if email fails, but log it
    }

    res.status(200).json({ 
      message: 'Profile request submitted successfully. Please check your email for OTP.',
      success: true
    });
  } catch (error) {
    console.error('Error submitting profile request:', error);
    res.status(500).json({ 
      message: 'Failed to submit profile request',
      error: error.message 
    });
  }
};

/**
 * Submit investor request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const submitInvestorRequest = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    // Validate required fields (email required, name and phone optional)
    if (!email) {
      return res.status(400).json({ 
        message: 'Email is required' 
      });
    }

    // Generate 4-digit OTP
    const otp = generateOTP();

    // Store in database (use email as name if name not provided)
    const investorRequest = await prisma.profileReport.create({
      data: {
        name: name || email,
        email,
        report: 'investor',
        otp,
        isEmailVerified: false
      }
    });

    // Send OTP email
    try {
      const emailHtml = otpEmailTemplate(name || email, otp, 'investor');
      await resendEmailBoilerRise(
        process.env.RISE_INVESTOR_AUTH_USER || process.env.GMAIL_AUTH_USER,
        email,
        'OTP Verification - RISE Investor Request',
        emailHtml
      );
      console.log('OTP email sent to:', email);
    } catch (emailError) {
      console.error('Error sending OTP email:', emailError);
      // Don't fail the request if email fails, but log it
    }

    res.status(200).json({ 
      message: 'Investor request submitted successfully. Please check your email for OTP.',
      success: true
    });
  } catch (error) {
    console.error('Error submitting investor request:', error);
    res.status(500).json({ 
      message: 'Failed to submit investor request',
      error: error.message 
    });
  }
};

/**
 * Submit report request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const submitReportRequest = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ 
        message: 'Name and email are required' 
      });
    }

    // Generate 4-digit OTP
    const otp = generateOTP();

    // Store in database
    const reportRequest = await prisma.profileReport.create({
      data: {
        name,
        email,
        report: 'report',
        otp,
        isEmailVerified: false
      }
    });

    // Send OTP email
    try {
      const emailHtml = otpEmailTemplate(name, otp, 'report');
      await resendEmailBoilerRise(
        process.env.RISE_INVESTOR_AUTH_USER || process.env.GMAIL_AUTH_USER,
        email,
        'OTP Verification - RISE Report Request',
        emailHtml
      );
      console.log('OTP email sent to:', email);
    } catch (emailError) {
      console.error('Error sending OTP email:', emailError);
      // Don't fail the request if email fails, but log it
    }

    res.status(200).json({ 
      message: 'Report request submitted successfully. Please check your email for OTP.',
      success: true
    });
  } catch (error) {
    console.error('Error submitting report request:', error);
    res.status(500).json({ 
      message: 'Failed to submit report request',
      error: error.message 
    });
  }
};

/**
 * Verify OTP and return PDF URL
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Validate required fields
    if (!email || !otp) {
      return res.status(400).json({ 
        message: 'Email and OTP are required' 
      });
    }

    // Find the record
    const record = await prisma.profileReport.findFirst({
      where: {
        email,
        otp,
        isEmailVerified: false
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!record) {
      return res.status(400).json({ 
        message: 'Invalid OTP or email. Please check and try again.' 
      });
    }

    // Check if OTP is expired (10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    if (record.createdAt < tenMinutesAgo) {
      return res.status(400).json({ 
        message: 'OTP has expired. Please request a new one.' 
      });
    }

    // Update record to mark as verified
    await prisma.profileReport.update({
      where: { id: record.id },
      data: { isEmailVerified: true }
    });

    // Determine PDF URL based on report type (investor doesn't need PDF)
    if (record.report === 'investor') {
      res.status(200).json({ 
        message: 'OTP verified successfully',
        success: true
      });
    } else {
      const pdfUrl = record.report === 'profile' 
        ? 'https://amzn-s3-rightintellectual.s3.ap-south-1.amazonaws.com/RIGHT_INTELLECTUAL_SERVICES_PROFILE-1.pdf'
        : 'https://amzn-s3-rightintellectual.s3.ap-south-1.amazonaws.com/RIGHT_INTELLECTUAL_SERVICES_ENTERPRISE_LTD_ANNUAL_REPORT-3.pdf';

      res.status(200).json({ 
        message: 'OTP verified successfully',
        success: true,
        pdfUrl: pdfUrl
      });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ 
      message: 'Failed to verify OTP',
      error: error.message 
    });
  }
};