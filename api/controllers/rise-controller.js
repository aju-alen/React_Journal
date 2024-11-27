
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

