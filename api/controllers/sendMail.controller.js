
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
export const contactUs = async (req, res) => {
    let from = req.body.email;
    let to = process.env.GMAIL_AUTH_USER;
    let subject = 'journal query';
    let message = req.body.message + ' ' + req.body.contact + ' ' + req.body.username;
  
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_AUTH_USER,
        pass: process.env.GMAIL_AUTH_PASS
      }
  
    })
    let mailOptions = {
      from: from,
      to: to,
      subject: subject,
      text: message
    }
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Email sent' })
      }
    })
  }
export const forgetPassword = async (req, res, next) => {
   
}

   
