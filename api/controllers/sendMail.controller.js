
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
export const contactUs = async (req, res) => {
    let from = req.body.email;
    let to = process.env.GMAIL_AUTH_USER;
    let subject = 'journal query';
    let message = `
    Sent From : ${req.body.email}
    Message : ${req.body.message}
    Contact : ${req.body.contact}
    Username : ${req.body.username}
    `;
    
  
    let transporter = nodemailer.createTransport({
      host: 'mail.privateemail.com',
      port: 587,
      secure: false,
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

   
