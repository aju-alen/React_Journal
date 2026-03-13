import { PrismaClient } from '@prisma/client';
import createError from '../utils/createError.js';
import { resendEmailBoilerCorpInk } from '../utils/resend-email-boiler.js';
import {
  corpinkServiceRequestConfirmationTemplate,
  corpinkServiceRequestNotificationTemplate,
  corpinkOtpEmailTemplate
} from '../utils/emailTemplates.js';

const prisma = new PrismaClient();
const CORPINK_SUPPORT_EMAIL = 'support@corpink.ae';
const CORPINK_SENDER = 'CorpInk <support@corpink.ae>';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const requestService = async (req, res, next) => {
  try {
    const { name, email, service } = req.body;

    if (!name || !email || !service) {
      return next(createError(400, 'Name, email, and service are required'));
    }

    await Promise.all([
      resendEmailBoilerCorpInk(
        CORPINK_SENDER,
        email,
        'Your Service Request Has Been Received - CorpInk',
        corpinkServiceRequestConfirmationTemplate(name)
      ),
      resendEmailBoilerCorpInk(
        CORPINK_SENDER,
        CORPINK_SUPPORT_EMAIL,
        `New Service Request from ${name}`,
        corpinkServiceRequestNotificationTemplate(name, email, service)
      )
    ]);

    res.status(200).json({ message: 'Service request submitted successfully' });
  } catch (err) {
    console.error('Error in requestService:', err);
    return next(createError(500, 'Failed to submit service request'));
  }
};

export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(createError(400, 'Email is required'));
    }

    const otp = generateOTP();

    await prisma.corpinkOtp.upsert({
      where: { email },
      update: { otp },
      create: { email, otp }
    });

    await resendEmailBoilerCorpInk(
      CORPINK_SENDER,
      email,
      'Your Verification Code - CorpInk',
      corpinkOtpEmailTemplate(otp)
    );

    res.status(200).json({ message: 'OTP sent successfully', success: true });
  } catch (err) {
    console.error('Error in sendOtp:', err);
    return next(createError(500, 'Failed to send OTP'));
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(createError(400, 'Email and OTP are required'));
    }

    const record = await prisma.corpinkOtp.findUnique({
      where: { email }
    });

    if (!record || record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP or email', success: false });
    }

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    if (record.updatedAt < tenMinutesAgo) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.', success: false });
    }

    await prisma.corpinkOtp.delete({ where: { email } });

    res.status(200).json({ message: 'OTP verified successfully', success: true });
  } catch (err) {
    console.error('Error in verifyOtp:', err);
    return next(createError(500, 'Failed to verify OTP'));
  }
};
