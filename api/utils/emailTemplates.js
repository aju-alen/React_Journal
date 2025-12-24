/**
 * Email templates for the application
 * These templates are separated from the controllers for better maintainability
 */

/**
 * Email verification template
 * @param {string} surname - User's surname
 * @param {string} verificationToken - Email verification token
 * @param {string} email - User's email address
 * @param {string} verifyUrl - Base URL for email verification
 * @returns {string} HTML email template
 */
export const emailVerificationTemplate = (surname, verificationToken, email, verifyUrl) => {
  const verificationLink = `${verifyUrl}/api/auth/verify/${verificationToken}/${email}`;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Verify Your Email - Scientific Journals Portal</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.7;
          color: #2d3748;
          background-color: #f7fafc;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .email-wrapper {
          background-color: #f7fafc;
          padding: 40px 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #543a31 0%, #6b4f47 100%);
          padding: 40px 30px;
          text-align: center;
        }
        .logo-container {
          margin-bottom: 15px;
        }
        .logo-container img {
          max-width: 180px;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .header-title {
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-top: 10px;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 20px;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 20px;
        }
        .message-text {
          font-size: 16px;
          color: #4a5568;
          margin-bottom: 16px;
          line-height: 1.8;
        }
        .highlight-box {
          background: linear-gradient(135deg, #fff5f5 0%, #fef5e7 100%);
          border-left: 4px solid #543a31;
          padding: 20px;
          margin: 30px 0;
          border-radius: 6px;
        }
        .highlight-text {
          font-size: 15px;
          color: #2d3748;
          font-weight: 500;
          line-height: 1.6;
        }
        .button-container {
          text-align: center;
          margin: 35px 0;
        }
        .verify-button {
          display: inline-block;
          padding: 16px 48px;
          background: linear-gradient(135deg, #543a31 0%, #6b4f47 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(84, 58, 49, 0.3);
          transition: all 0.3s ease;
          text-transform: uppercase;
        }
        .verify-button:hover {
          background: linear-gradient(135deg, #3d2a23 0%, #543a31 100%);
          box-shadow: 0 6px 16px rgba(84, 58, 49, 0.4);
          transform: translateY(-2px);
        }
        .expiry-notice {
          text-align: center;
          margin: 25px 0;
          padding: 15px;
          background-color: #fff9e6;
          border-radius: 6px;
          border: 1px solid #f6e05e;
        }
        .expiry-text {
          font-size: 14px;
          color: #744210;
          font-weight: 500;
        }
        .alternative-section {
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid #e2e8f0;
        }
        .alternative-title {
          font-size: 14px;
          color: #718096;
          font-weight: 600;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .link-box {
          background-color: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 15px;
          margin-top: 15px;
          word-break: break-all;
        }
        .verification-link {
          color: #543a31;
          font-size: 13px;
          font-family: 'Courier New', monospace;
          text-decoration: none;
          line-height: 1.6;
        }
        .footer {
          background-color: #f7fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-text {
          font-size: 13px;
          color: #718096;
          line-height: 1.6;
          margin-bottom: 10px;
        }
        .footer-brand {
          font-size: 14px;
          color: #543a31;
          font-weight: 600;
          margin-top: 15px;
        }
        @media only screen and (max-width: 600px) {
          .email-wrapper {
            padding: 20px 10px;
          }
          .header {
            padding: 30px 20px;
          }
          .content {
            padding: 30px 20px;
          }
          .verify-button {
            padding: 14px 32px;
            font-size: 14px;
          }
          .header-title {
            font-size: 20px;
          }
          .greeting {
            font-size: 18px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <div class="logo-container">
              <img src="https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/logo-removebg-preview.jpg" 
                   alt="Scientific Journals Portal Logo" />
            </div>
            <h1 class="header-title">Scientific Journals Portal</h1>
          </div>
          
          <!-- Content -->
          <div class="content">
            <p class="greeting">Hi ${surname},</p>
            
            <p class="message-text">You're almost there! 🎉</p>
            
            <p class="message-text">
              We just need to verify your email address before you can access your Scientific Journals Portal account. 
              Verifying your email helps secure your account and ensures you receive important updates.
            </p>
            
            <div class="highlight-box">
              <p class="highlight-text">
                <strong>🔒 Security Note:</strong> This verification link is unique to your account and will help protect your personal information.
              </p>
            </div>
            
            <div class="button-container">
              <a href="${verificationLink}" class="verify-button">Verify Your Email Address</a>
            </div>
            
            <div class="expiry-notice">
              <p class="expiry-text">⏰ This verification link will expire in <strong>48 hours</strong> for security purposes.</p>
            </div>
            
            <div class="alternative-section">
              <p class="alternative-title">Having trouble with the button?</p>
              <p class="message-text" style="font-size: 14px; margin-bottom: 10px;">
                If the button above doesn't work, you can copy and paste the following link into your web browser:
              </p>
              <div class="link-box">
                <a href="${verificationLink}" class="verification-link">${verificationLink}</a>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p class="footer-text">
              This is an automated message from Scientific Journals Portal. 
              Please do not reply to this email.
            </p>
            <p class="footer-text">
              If you did not create an account with us, please ignore this email or contact our support team.
            </p>
            <p class="footer-brand">Scientific Journals Portal © ${new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Password reset email template
 * @param {string} name - User's name
 * @param {string} resetTokenWithTimestamp - Password reset token with timestamp
 * @param {string} resetUrl - Base URL for password reset
 * @returns {string} HTML email template
 */
export const passwordResetTemplate = (name, resetTokenWithTimestamp, resetUrl) => {
  const resetLink = `${resetUrl}/api/auth/reset-password/${resetTokenWithTimestamp}`;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Reset Your Password - Scientific Journals Portal</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.7;
          color: #2d3748;
          background-color: #f7fafc;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .email-wrapper {
          background-color: #f7fafc;
          padding: 40px 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #543a31 0%, #6b4f47 100%);
          padding: 40px 30px;
          text-align: center;
        }
        .logo-container {
          margin-bottom: 15px;
        }
        .logo-container img {
          max-width: 180px;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .header-title {
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-top: 10px;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 20px;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 20px;
        }
        .message-text {
          font-size: 16px;
          color: #4a5568;
          margin-bottom: 16px;
          line-height: 1.8;
        }
        .warning-box {
          background: linear-gradient(135deg, #fff5f5 0%, #fef5e7 100%);
          border-left: 4px solid #e53e3e;
          padding: 20px;
          margin: 30px 0;
          border-radius: 6px;
        }
        .warning-text {
          font-size: 15px;
          color: #2d3748;
          font-weight: 500;
          line-height: 1.6;
        }
        .button-container {
          text-align: center;
          margin: 35px 0;
        }
        .reset-button {
          display: inline-block;
          padding: 16px 48px;
          background: linear-gradient(135deg, #543a31 0%, #6b4f47 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(84, 58, 49, 0.3);
          transition: all 0.3s ease;
          text-transform: uppercase;
        }
        .reset-button:hover {
          background: linear-gradient(135deg, #3d2a23 0%, #543a31 100%);
          box-shadow: 0 6px 16px rgba(84, 58, 49, 0.4);
          transform: translateY(-2px);
        }
        .expiry-notice {
          text-align: center;
          margin: 25px 0;
          padding: 15px;
          background-color: #fed7d7;
          border-radius: 6px;
          border: 1px solid #fc8181;
        }
        .expiry-text {
          font-size: 14px;
          color: #742a2a;
          font-weight: 600;
        }
        .alternative-section {
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid #e2e8f0;
        }
        .alternative-title {
          font-size: 14px;
          color: #718096;
          font-weight: 600;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .link-box {
          background-color: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 15px;
          margin-top: 15px;
          word-break: break-all;
        }
        .reset-link {
          color: #543a31;
          font-size: 13px;
          font-family: 'Courier New', monospace;
          text-decoration: none;
          line-height: 1.6;
        }
        .security-info {
          background-color: #edf2f7;
          padding: 20px;
          border-radius: 6px;
          margin-top: 30px;
          border: 1px solid #cbd5e0;
        }
        .security-title {
          font-size: 14px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 10px;
        }
        .security-text {
          font-size: 13px;
          color: #4a5568;
          line-height: 1.7;
        }
        .signature {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }
        .signature-text {
          font-size: 15px;
          color: #4a5568;
          margin-bottom: 5px;
          font-weight: 500;
        }
        .footer {
          background-color: #f7fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-text {
          font-size: 13px;
          color: #718096;
          line-height: 1.6;
          margin-bottom: 10px;
        }
        .footer-brand {
          font-size: 14px;
          color: #543a31;
          font-weight: 600;
          margin-top: 15px;
        }
        @media only screen and (max-width: 600px) {
          .email-wrapper {
            padding: 20px 10px;
          }
          .header {
            padding: 30px 20px;
          }
          .content {
            padding: 30px 20px;
          }
          .reset-button {
            padding: 14px 32px;
            font-size: 14px;
          }
          .header-title {
            font-size: 20px;
          }
          .greeting {
            font-size: 18px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <div class="logo-container">
              <img src="https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/logo-removebg-preview.jpg" 
                   alt="Scientific Journals Portal Logo" />
            </div>
            <h1 class="header-title">Scientific Journals Portal</h1>
          </div>
          
          <!-- Content -->
          <div class="content">
            <p class="greeting">Hi ${name},</p>
            
            <p class="message-text">
              We received a request to reset the password for your Scientific Journals Portal account. 
              If you didn't make this request, you can safely ignore this email.
            </p>
            
            <div class="warning-box">
              <p class="warning-text">
                <strong>🔐 Security Alert:</strong> If you didn't request a password reset, please ignore this email 
                and ensure your account remains secure. Your password will not be changed unless you click the button below.
              </p>
            </div>
            
            <div class="button-container">
              <a href="${resetLink}" class="reset-button">Reset Your Password</a>
            </div>
            
            <div class="expiry-notice">
              <p class="expiry-text">⚠️ This link will expire in <strong>30 minutes</strong> for your security. 
              If it expires, you can request a new password reset link.</p>
            </div>
            
            <div class="alternative-section">
              <p class="alternative-title">Button not working?</p>
              <p class="message-text" style="font-size: 14px; margin-bottom: 10px;">
                If the button above doesn't work, copy and paste the following link into your web browser:
              </p>
              <div class="link-box">
                <a href="${resetLink}" class="reset-link">${resetLink}</a>
              </div>
            </div>
            
            <div class="security-info">
              <p class="security-title">💡 Password Security Tips:</p>
              <ul class="security-text" style="margin-left: 20px; margin-top: 10px;">
                <li>Use a strong, unique password that you don't use elsewhere</li>
                <li>Include a mix of uppercase, lowercase, numbers, and symbols</li>
                <li>Never share your password with anyone</li>
                <li>Consider using a password manager for better security</li>
              </ul>
            </div>
            
            <div class="signature">
              <p class="signature-text">Warm Regards,</p>
              <p class="signature-text">Scientific Journals Team</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p class="footer-text">
              This is an automated security message from Scientific Journals Portal. 
              Please do not reply to this email.
            </p>
            <p class="footer-text">
              If you have any concerns about your account security, please contact our support team immediately.
            </p>
            <p class="footer-brand">Scientific Journals Portal © ${new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};


/**
 * Marketing email template
 * @param {string} emailContent - HTML content for the marketing email
 * @returns {string} HTML email template
 */
export const markettingEmailTemplate = (emailContent) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Newsletter - Scientific Journals Portal</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.7;
          color: #2d3748;
          background-color: #f7fafc;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .email-wrapper {
          background-color: #f7fafc;
          padding: 40px 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #543a31 0%, #6b4f47 100%);
          padding: 40px 30px;
          text-align: center;
        }
        .logo-container {
          margin-bottom: 15px;
        }
        .logo-container img {
          max-width: 180px;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .header-title {
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-top: 10px;
        }
        .header-subtitle {
          color: #ffffff;
          font-size: 14px;
          font-weight: 400;
          margin-top: 8px;
          opacity: 0.9;
        }
        .content {
          padding: 40px 30px;
        }
        .email-body {
          font-size: 16px;
          color: #4a5568;
          line-height: 1.8;
        }
        .email-body h1,
        .email-body h2,
        .email-body h3,
        .email-body h4 {
          color: #1a202c;
          margin-top: 24px;
          margin-bottom: 16px;
          font-weight: 600;
        }
        .email-body h1 {
          font-size: 28px;
        }
        .email-body h2 {
          font-size: 24px;
        }
        .email-body h3 {
          font-size: 20px;
        }
        .email-body h4 {
          font-size: 18px;
        }
        .email-body p {
          margin-bottom: 16px;
        }
        .email-body ul,
        .email-body ol {
          margin-left: 20px;
          margin-bottom: 16px;
        }
        .email-body li {
          margin-bottom: 8px;
        }
        .email-body a {
          color: #543a31;
          text-decoration: underline;
          font-weight: 500;
        }
        .email-body a:hover {
          color: #3d2a23;
        }
        .email-body img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 20px 0;
        }
        .email-body blockquote {
          border-left: 4px solid #543a31;
          padding-left: 20px;
          margin: 20px 0;
          color: #4a5568;
          font-style: italic;
        }
        .cta-section {
          text-align: center;
          margin: 35px 0;
          padding: 25px;
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border-radius: 8px;
        }
        .cta-button {
          display: inline-block;
          padding: 14px 36px;
          background: linear-gradient(135deg, #543a31 0%, #6b4f47 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(84, 58, 49, 0.3);
          transition: all 0.3s ease;
          text-transform: uppercase;
          margin: 10px;
        }
        .signature {
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid #e2e8f0;
        }
        .signature-text {
          font-size: 15px;
          color: #4a5568;
          margin-bottom: 5px;
          font-weight: 500;
        }
        .signature-link {
          color: #543a31;
          text-decoration: none;
          font-weight: 600;
        }
        .signature-link:hover {
          color: #3d2a23;
          text-decoration: underline;
        }
        .footer {
          background-color: #f7fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-links {
          margin-bottom: 20px;
        }
        .footer-link {
          color: #543a31;
          text-decoration: none;
          font-size: 13px;
          margin: 0 12px;
          font-weight: 500;
        }
        .footer-link:hover {
          text-decoration: underline;
        }
        .footer-text {
          font-size: 13px;
          color: #718096;
          line-height: 1.6;
          margin-bottom: 10px;
        }
        .footer-brand {
          font-size: 14px;
          color: #543a31;
          font-weight: 600;
          margin-top: 15px;
        }
        .unsubscribe {
          font-size: 12px;
          color: #a0aec0;
          margin-top: 20px;
        }
        .unsubscribe-link {
          color: #718096;
          text-decoration: underline;
        }
        @media only screen and (max-width: 600px) {
          .email-wrapper {
            padding: 20px 10px;
          }
          .header {
            padding: 30px 20px;
          }
          .content {
            padding: 30px 20px;
          }
          .header-title {
            font-size: 20px;
          }
          .email-body {
            font-size: 15px;
          }
          .email-body h1 {
            font-size: 24px;
          }
          .email-body h2 {
            font-size: 20px;
          }
          .email-body h3 {
            font-size: 18px;
          }
          .cta-button {
            padding: 12px 28px;
            font-size: 14px;
          }
          .footer-link {
            display: block;
            margin: 8px 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <div class="logo-container">
              <img src="https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/logo-removebg-preview.jpg" 
                   alt="Scientific Journals Portal Logo" />
            </div>
            <h1 class="header-title">Scientific Journals Portal</h1>
            <p class="header-subtitle">Stay Updated with Latest Research & Publications</p>
          </div>
          
          <!-- Content -->
          <div class="content">
            <div class="email-body">
              ${emailContent}
            </div>
            
            <div class="signature">
              <p class="signature-text">Best Regards,</p>
              <p class="signature-text">
                <a href="https://scientificjournalsportal.com/" class="signature-link">Scientific Journals Team</a>
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <div class="footer-links">
              <a href="https://scientificjournalsportal.com/" class="footer-link">Visit Our Website</a>
              <a href="https://scientificjournalsportal.com/journal/publications" class="footer-link">Browse Journals</a>
              <a href="https://scientificjournalsportal.com/contact/new" class="footer-link">Contact Us</a>
            </div>
            
            <p class="footer-text">
              Scientific Journals Portal (SJP) is the publishing brand of Right Intellectual Services Enterprise (RISE) Ltd., 
              DIFC, Dubai, UAE.
            </p>
            
            <p class="footer-brand">Scientific Journals Portal © ${new Date().getFullYear()}</p>
            
            <p class="unsubscribe">
              You are receiving this email because you subscribed to our marketing communications. 
              <a href="#" class="unsubscribe-link">Unsubscribe</a> or 
              <a href="https://scientificjournalsportal.com/" class="unsubscribe-link">manage your preferences</a>.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Welcome email template
 * @param {string} surname - User's surname
 * @param {string} email - User's email address
 * @param {string} verifyUrl - Base URL (optional, for future use)
 * @returns {string} HTML email template
 */
export const welcomeEmailTemplate = (surname, email, verifyUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Welcome to Scientific Journals Portal</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.7;
          color: #2d3748;
          background-color: #f7fafc;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .email-wrapper {
          background-color: #f7fafc;
          padding: 40px 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #543a31 0%, #6b4f47 100%);
          padding: 50px 30px;
          text-align: center;
        }
        .logo-container {
          margin-bottom: 20px;
        }
        .logo-container img {
          max-width: 180px;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .header-title {
          color: #ffffff;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-top: 15px;
        }
        .header-subtitle {
          color: #ffffff;
          font-size: 16px;
          font-weight: 400;
          margin-top: 10px;
          opacity: 0.95;
        }
        .content {
          padding: 40px 30px;
        }
        .welcome-icon {
          text-align: center;
          font-size: 64px;
          margin-bottom: 20px;
        }
        .greeting {
          font-size: 24px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 20px;
          text-align: center;
        }
        .welcome-message {
          font-size: 18px;
          color: #4a5568;
          text-align: center;
          margin-bottom: 30px;
          line-height: 1.8;
        }
        .features-section {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          padding: 30px;
          border-radius: 8px;
          margin: 30px 0;
        }
        .features-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 20px;
          text-align: center;
        }
        .feature-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 20px;
          padding: 15px;
          background-color: #ffffff;
          border-radius: 6px;
          border-left: 4px solid #543a31;
        }
        .feature-icon {
          font-size: 24px;
          margin-right: 15px;
          flex-shrink: 0;
        }
        .feature-content {
          flex: 1;
        }
        .feature-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 5px;
        }
        .feature-text {
          font-size: 14px;
          color: #4a5568;
          line-height: 1.6;
        }
        .cta-section {
          text-align: center;
          margin: 35px 0;
        }
        .cta-button {
          display: inline-block;
          padding: 16px 48px;
          background: linear-gradient(135deg, #543a31 0%, #6b4f47 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(84, 58, 49, 0.3);
          transition: all 0.3s ease;
          text-transform: uppercase;
          margin: 5px;
        }
        .cta-button:hover {
          background: linear-gradient(135deg, #3d2a23 0%, #543a31 100%);
          box-shadow: 0 6px 16px rgba(84, 58, 49, 0.4);
          transform: translateY(-2px);
        }
        .secondary-button {
          display: inline-block;
          padding: 14px 36px;
          background-color: #ffffff;
          color: #543a31 !important;
          text-decoration: none;
          border: 2px solid #543a31;
          border-radius: 8px;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.5px;
          margin: 5px;
        }
        .secondary-button:hover {
          background-color: #f7fafc;
        }
        .help-section {
          background-color: #fff9e6;
          border: 1px solid #f6e05e;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
          text-align: center;
        }
        .help-title {
          font-size: 16px;
          font-weight: 600;
          color: #744210;
          margin-bottom: 10px;
        }
        .help-text {
          font-size: 14px;
          color: #744210;
          line-height: 1.6;
        }
        .help-link {
          color: #543a31;
          text-decoration: underline;
          font-weight: 600;
        }
        .signature {
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
        }
        .signature-text {
          font-size: 15px;
          color: #4a5568;
          margin-bottom: 5px;
          font-weight: 500;
        }
        .footer {
          background-color: #f7fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-links {
          margin-bottom: 20px;
        }
        .footer-link {
          color: #543a31;
          text-decoration: none;
          font-size: 13px;
          margin: 0 12px;
          font-weight: 500;
        }
        .footer-link:hover {
          text-decoration: underline;
        }
        .footer-text {
          font-size: 13px;
          color: #718096;
          line-height: 1.6;
          margin-bottom: 10px;
        }
        .footer-brand {
          font-size: 14px;
          color: #543a31;
          font-weight: 600;
          margin-top: 15px;
        }
        .social-links {
          margin: 20px 0;
        }
        .social-link {
          display: inline-block;
          margin: 0 8px;
          color: #543a31;
          text-decoration: none;
          font-weight: 500;
        }
        @media only screen and (max-width: 600px) {
          .email-wrapper {
            padding: 20px 10px;
          }
          .header {
            padding: 40px 20px;
          }
          .content {
            padding: 30px 20px;
          }
          .header-title {
            font-size: 24px;
          }
          .greeting {
            font-size: 20px;
          }
          .welcome-message {
            font-size: 16px;
          }
          .cta-button,
          .secondary-button {
            display: block;
            margin: 10px 0;
            width: 100%;
            text-align: center;
          }
          .feature-item {
            flex-direction: column;
            text-align: center;
          }
          .feature-icon {
            margin-right: 0;
            margin-bottom: 10px;
          }
          .footer-link {
            display: block;
            margin: 8px 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <div class="logo-container">
              <img src="https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/logo-removebg-preview.jpg" 
                   alt="Scientific Journals Portal Logo" />
            </div>
            <h1 class="header-title">Welcome Aboard!</h1>
            <p class="header-subtitle">We're thrilled to have you join our research community</p>
          </div>
          
          <!-- Content -->
          <div class="content">
            <div class="welcome-icon">🎉</div>
            
            <p class="greeting">Hi ${surname}!</p>
            
            <p class="welcome-message">
              Welcome to the Scientific Journals Portal! We're excited to have you as part of our community of 
              researchers, academics, and knowledge seekers. Your journey towards contributing to and accessing 
              high-quality scientific research starts here.
            </p>
            
            <div class="features-section">
              <h2 class="features-title">What You Can Do</h2>
              
              <div class="feature-item">
                <div class="feature-icon">📚</div>
                <div class="feature-content">
                  <div class="feature-title">Browse Journals & Publications</div>
                  <div class="feature-text">
                    Explore our diverse collection of peer-reviewed journals across multiple disciplines including 
                    engineering, medical science, social sciences, and more.
                  </div>
                </div>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">📝</div>
                <div class="feature-content">
                  <div class="feature-title">Submit Your Research</div>
                  <div class="feature-text">
                    Share your research findings with the global academic community through our rigorous 
                    peer-review process.
                  </div>
                </div>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">🔬</div>
                <div class="feature-content">
                  <div class="feature-title">Stay Updated</div>
                  <div class="feature-text">
                    Receive notifications about the latest publications, conferences, and research opportunities 
                    in your field.
                  </div>
                </div>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">🤝</div>
                <div class="feature-content">
                  <div class="feature-title">Join Conferences</div>
                  <div class="feature-text">
                    Connect with fellow researchers and participate in conferences to share knowledge and 
                    collaborate.
                  </div>
                </div>
              </div>
            </div>
            
            <div class="cta-section">
              <a href="https://scientificjournalsportal.com/journal/publications" class="cta-button">
                Explore Journals
              </a>
              <a href="https://scientificjournalsportal.com/" class="secondary-button">
                Visit Portal
              </a>
            </div>
            
            <div class="help-section">
              <p class="help-title">💬 Need Help Getting Started?</p>
              <p class="help-text">
                Check out our <a href="https://scientificjournalsportal.com/faq/authorfaq" class="help-link">Author FAQ</a> 
                or <a href="https://scientificjournalsportal.com/contact/new" class="help-link">contact our support team</a> 
                if you have any questions. We're here to help!
              </p>
            </div>
            
            <div class="signature">
              <p class="signature-text">Happy researching!</p>
              <p class="signature-text">Best Regards,</p>
              <p class="signature-text">
                <a href="https://scientificjournalsportal.com/" style="color: #543a31; text-decoration: none; font-weight: 600;">
                  Scientific Journals Team
                </a>
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <div class="footer-links">
              <a href="https://scientificjournalsportal.com/" class="footer-link">Home</a>
              <a href="https://scientificjournalsportal.com/journal/publications" class="footer-link">Journals</a>
              <a href="https://scientificjournalsportal.com/conferences" class="footer-link">Conferences</a>
              <a href="https://scientificjournalsportal.com/contact/new" class="footer-link">Contact Us</a>
            </div>
            
            <p class="footer-text">
              Scientific Journals Portal (SJP) is the publishing brand of Right Intellectual Services Enterprise (RISE) Ltd., 
              DIFC, Dubai, UAE.
            </p>
            
            <p class="footer-text">
              SJP serves as a publisher for a wide range of hybrid – open and subscription access journals 
              that undergo rigorous peer review.
            </p>
            
            <p class="footer-brand">Scientific Journals Portal © ${new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Article submission confirmation email template
 * @param {string} email - Author's email address
 * @returns {string} HTML email template
 */
export const articleSubmittedEmailTemplate = (email) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Article Submitted Successfully - Scientific Journals Portal</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.7;
          color: #2d3748;
          background-color: #f7fafc;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .email-wrapper {
          background-color: #f7fafc;
          padding: 40px 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #543a31 0%, #6b4f47 100%);
          padding: 40px 30px;
          text-align: center;
        }
        .logo-container {
          margin-bottom: 15px;
        }
        .logo-container img {
          max-width: 180px;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .header-title {
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-top: 10px;
        }
        .content {
          padding: 40px 30px;
        }
        .success-icon {
          text-align: center;
          font-size: 64px;
          margin-bottom: 20px;
        }
        .greeting {
          font-size: 22px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 20px;
          text-align: center;
        }
        .success-message {
          font-size: 18px;
          color: #22c55e;
          text-align: center;
          margin-bottom: 30px;
          font-weight: 600;
        }
        .message-text {
          font-size: 16px;
          color: #4a5568;
          margin-bottom: 16px;
          line-height: 1.8;
        }
        .info-box {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border-left: 4px solid #22c55e;
          padding: 20px;
          margin: 30px 0;
          border-radius: 6px;
        }
        .info-title {
          font-size: 16px;
          font-weight: 700;
          color: #065f46;
          margin-bottom: 10px;
        }
        .info-text {
          font-size: 15px;
          color: #047857;
          line-height: 1.7;
        }
        .process-section {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          padding: 30px;
          border-radius: 8px;
          margin: 30px 0;
        }
        .process-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 20px;
          text-align: center;
        }
        .process-step {
          display: flex;
          align-items: flex-start;
          margin-bottom: 20px;
          padding: 15px;
          background-color: #ffffff;
          border-radius: 6px;
          border-left: 4px solid #543a31;
        }
        .step-number {
          font-size: 20px;
          font-weight: 700;
          color: #543a31;
          margin-right: 15px;
          flex-shrink: 0;
          min-width: 30px;
          text-align: center;
        }
        .step-content {
          flex: 1;
        }
        .step-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 5px;
        }
        .step-text {
          font-size: 14px;
          color: #4a5568;
          line-height: 1.6;
        }
        .cta-section {
          text-align: center;
          margin: 35px 0;
        }
        .cta-button {
          display: inline-block;
          padding: 16px 48px;
          background: linear-gradient(135deg, #543a31 0%, #6b4f47 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(84, 58, 49, 0.3);
          transition: all 0.3s ease;
          text-transform: uppercase;
        }
        .cta-button:hover {
          background: linear-gradient(135deg, #3d2a23 0%, #543a31 100%);
          box-shadow: 0 6px 16px rgba(84, 58, 49, 0.4);
          transform: translateY(-2px);
        }
        .timeline-box {
          background-color: #fff9e6;
          border: 1px solid #f6e05e;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
          text-align: center;
        }
        .timeline-title {
          font-size: 16px;
          font-weight: 600;
          color: #744210;
          margin-bottom: 10px;
        }
        .timeline-text {
          font-size: 14px;
          color: #744210;
          line-height: 1.6;
        }
        .support-section {
          background-color: #edf2f7;
          padding: 20px;
          border-radius: 8px;
          margin: 30px 0;
          border: 1px solid #cbd5e0;
        }
        .support-title {
          font-size: 14px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 10px;
        }
        .support-text {
          font-size: 13px;
          color: #4a5568;
          line-height: 1.7;
        }
        .support-link {
          color: #543a31;
          text-decoration: underline;
          font-weight: 600;
        }
        .signature {
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
        }
        .signature-text {
          font-size: 15px;
          color: #4a5568;
          margin-bottom: 5px;
          font-weight: 500;
        }
        .footer {
          background-color: #f7fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-text {
          font-size: 13px;
          color: #718096;
          line-height: 1.6;
          margin-bottom: 10px;
        }
        .footer-brand {
          font-size: 14px;
          color: #543a31;
          font-weight: 600;
          margin-top: 15px;
        }
        @media only screen and (max-width: 600px) {
          .email-wrapper {
            padding: 20px 10px;
          }
          .header {
            padding: 30px 20px;
          }
          .content {
            padding: 30px 20px;
          }
          .header-title {
            font-size: 20px;
          }
          .greeting {
            font-size: 20px;
          }
          .success-message {
            font-size: 16px;
          }
          .cta-button {
            padding: 14px 32px;
            font-size: 14px;
            width: 100%;
            display: block;
          }
          .process-step {
            flex-direction: column;
          }
          .step-number {
            margin-right: 0;
            margin-bottom: 10px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <div class="logo-container">
              <img src="https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/logo-removebg-preview.jpg" 
                   alt="Scientific Journals Portal Logo" />
            </div>
            <h1 class="header-title">Scientific Journals Portal</h1>
          </div>
          
          <!-- Content -->
          <div class="content">
            <div class="success-icon">✅</div>
            
            <p class="greeting">Article Submitted Successfully!</p>
            
            <p class="success-message">Thank you for your submission</p>
            
            <p class="message-text">
              We have successfully received your article submission to the Scientific Journals Portal. 
              Your manuscript has been submitted and is now in our system for review.
            </p>
            
            <div class="info-box">
              <p class="info-title">📋 What Happens Next?</p>
              <p class="info-text">
                Your article will be reviewed by our editorial team. You will receive email notifications 
                at each stage of the review process. Please monitor your email regularly for updates.
              </p>
            </div>
            
            <div class="process-section">
              <h2 class="process-title">Review Process Timeline</h2>
              
              <div class="process-step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <div class="step-title">Initial Review</div>
                  <div class="step-text">
                    Our editorial team will perform an initial review to ensure your submission meets 
                    our journal's scope and formatting requirements.
                  </div>
                </div>
              </div>
              
              <div class="process-step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <div class="step-title">Peer Review</div>
                  <div class="step-text">
                    If your article passes the initial review, it will be sent to expert reviewers in your field 
                    for a thorough peer review evaluation.
                  </div>
                </div>
              </div>
              
              <div class="process-step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <div class="step-title">Editorial Decision</div>
                  <div class="step-text">
                    Based on the reviewers' feedback, our editorial board will make a decision regarding 
                    publication, revision, or rejection.
                  </div>
                </div>
              </div>
              
              <div class="process-step">
                <div class="step-number">4</div>
                <div class="step-content">
                  <div class="step-title">Notification</div>
                  <div class="step-text">
                    You will be notified via email of the editorial decision along with detailed feedback 
                    from the reviewers.
                  </div>
                </div>
              </div>
            </div>
            
            <div class="timeline-box">
              <p class="timeline-title">⏱️ Expected Timeline</p>
              <p class="timeline-text">
                The review process typically takes <strong>4-8 weeks</strong>, depending on the complexity 
                of your article and reviewer availability. We appreciate your patience during this process.
              </p>
            </div>
            
            <div class="cta-section">
              <a href="https://scientificjournalsportal.com/" class="cta-button">
                View Your Dashboard
              </a>
            </div>
            
            <div class="support-section">
              <p class="support-title">💡 Need Assistance?</p>
              <p class="support-text">
                If you have any questions about your submission or the review process, please don't hesitate to 
                <a href="https://scientificjournalsportal.com/contact/new" class="support-link">contact our support team</a>. 
                You can also check our <a href="https://scientificjournalsportal.com/faq/authorfaq" class="support-link">Author FAQ</a> 
                for more information.
              </p>
            </div>
            
            <div class="signature">
              <p class="signature-text">Thank you for choosing Scientific Journals Portal.</p>
              <p class="signature-text">Best Regards,</p>
              <p class="signature-text">Editorial Team</p>
              <p class="signature-text">
                <a href="https://scientificjournalsportal.com/" style="color: #543a31; text-decoration: none; font-weight: 600;">
                  Scientific Journals Portal
                </a>
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p class="footer-text">
              This is an automated confirmation email from Scientific Journals Portal. 
              Please do not reply to this email.
            </p>
            <p class="footer-text">
              All communication regarding your submission will be sent to this email address. 
              Please ensure your email is active and check your spam folder if you don't receive updates.
            </p>
            <p class="footer-brand">Scientific Journals Portal © ${new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Article rejection/revision required email template
 * @param {string} email - Author's email address
 * @returns {string} HTML email template
 */
export const articleRejectionEmailTemplate = (email) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Article Revision Required - Scientific Journals Portal</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.7;
          color: #2d3748;
          background-color: #f7fafc;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .email-wrapper {
          background-color: #f7fafc;
          padding: 40px 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #543a31 0%, #6b4f47 100%);
          padding: 40px 30px;
          text-align: center;
        }
        .logo-container {
          margin-bottom: 15px;
        }
        .logo-container img {
          max-width: 180px;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .header-title {
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-top: 10px;
        }
        .content {
          padding: 40px 30px;
        }
        .status-icon {
          text-align: center;
          font-size: 64px;
          margin-bottom: 20px;
        }
        .greeting {
          font-size: 22px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 20px;
        }
        .message-text {
          font-size: 16px;
          color: #4a5568;
          margin-bottom: 16px;
          line-height: 1.8;
        }
        .status-box {
          background: linear-gradient(135deg, #fff5f5 0%, #fef5e7 100%);
          border-left: 4px solid #f59e0b;
          padding: 20px;
          margin: 30px 0;
          border-radius: 6px;
        }
        .status-title {
          font-size: 18px;
          font-weight: 700;
          color: #92400e;
          margin-bottom: 10px;
        }
        .status-text {
          font-size: 15px;
          color: #78350f;
          line-height: 1.7;
        }
        .revision-box {
          background-color: #edf2f7;
          padding: 25px;
          border-radius: 8px;
          margin: 30px 0;
          border: 1px solid #cbd5e0;
        }
        .revision-title {
          font-size: 18px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 15px;
        }
        .revision-list {
          margin-left: 20px;
          margin-top: 15px;
        }
        .revision-item {
          font-size: 15px;
          color: #4a5568;
          margin-bottom: 12px;
          line-height: 1.7;
          padding-left: 10px;
        }
        .encouragement-box {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border-left: 4px solid #10b981;
          padding: 20px;
          margin: 30px 0;
          border-radius: 6px;
        }
        .encouragement-title {
          font-size: 16px;
          font-weight: 700;
          color: #065f46;
          margin-bottom: 10px;
        }
        .encouragement-text {
          font-size: 15px;
          color: #047857;
          line-height: 1.7;
        }
        .cta-section {
          text-align: center;
          margin: 35px 0;
        }
        .cta-button {
          display: inline-block;
          padding: 16px 48px;
          background: linear-gradient(135deg, #543a31 0%, #6b4f47 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(84, 58, 49, 0.3);
          transition: all 0.3s ease;
          text-transform: uppercase;
        }
        .cta-button:hover {
          background: linear-gradient(135deg, #3d2a23 0%, #543a31 100%);
          box-shadow: 0 6px 16px rgba(84, 58, 49, 0.4);
          transform: translateY(-2px);
        }
        .secondary-button {
          display: inline-block;
          padding: 14px 36px;
          background-color: #ffffff;
          color: #543a31 !important;
          text-decoration: none;
          border: 2px solid #543a31;
          border-radius: 8px;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.5px;
          margin: 5px;
        }
        .secondary-button:hover {
          background-color: #f7fafc;
        }
        .support-section {
          background-color: #fff9e6;
          border: 1px solid #f6e05e;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
        }
        .support-title {
          font-size: 16px;
          font-weight: 600;
          color: #744210;
          margin-bottom: 10px;
        }
        .support-text {
          font-size: 14px;
          color: #744210;
          line-height: 1.7;
        }
        .support-link {
          color: #543a31;
          text-decoration: underline;
          font-weight: 600;
        }
        .signature {
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid #e2e8f0;
        }
        .signature-text {
          font-size: 15px;
          color: #4a5568;
          margin-bottom: 5px;
          font-weight: 500;
        }
        .footer {
          background-color: #f7fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-text {
          font-size: 13px;
          color: #718096;
          line-height: 1.6;
          margin-bottom: 10px;
        }
        .footer-brand {
          font-size: 14px;
          color: #543a31;
          font-weight: 600;
          margin-top: 15px;
        }
        @media only screen and (max-width: 600px) {
          .email-wrapper {
            padding: 20px 10px;
          }
          .header {
            padding: 30px 20px;
          }
          .content {
            padding: 30px 20px;
          }
          .header-title {
            font-size: 20px;
          }
          .greeting {
            font-size: 20px;
          }
          .cta-button,
          .secondary-button {
            display: block;
            margin: 10px 0;
            width: 100%;
            text-align: center;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <div class="logo-container">
              <img src="https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/logo-removebg-preview.jpg" 
                   alt="Scientific Journals Portal Logo" />
            </div>
            <h1 class="header-title">Scientific Journals Portal</h1>
          </div>
          
          <!-- Content -->
          <div class="content">
            <div class="status-icon">📝</div>
            
            <p class="greeting">Hi there,</p>
            
            <p class="message-text">
              I hope this email finds you well. I wanted to personally update you regarding the status 
              of your recent article submission.
            </p>
            
            <div class="status-box">
              <p class="status-title">Article Revision Required</p>
              <p class="status-text">
                After careful review by our editorial team, we have decided that your article requires 
                revisions to align more closely with our publication standards. However, please don't 
                be discouraged—your effort is highly appreciated, and we believe your work has merit.
              </p>
            </div>
            
            <p class="message-text">
              We have returned your article to your dashboard for further editing. Please take some 
              time to review the detailed feedback provided by our editorial team and reviewers, and 
              make the necessary adjustments to strengthen your submission.
            </p>
            
            <div class="revision-box">
              <p class="revision-title">📋 Next Steps for Revision:</p>
              <ul class="revision-list">
                <li class="revision-item">
                  <strong>Review Feedback:</strong> Carefully read through all feedback and comments 
                  provided in your dashboard
                </li>
                <li class="revision-item">
                  <strong>Address Concerns:</strong> Make revisions that address the specific points 
                  raised by the reviewers
                </li>
                <li class="revision-item">
                  <strong>Resubmit:</strong> Once you've completed the revisions, you can resubmit 
                  your article through your dashboard
                </li>
                <li class="revision-item">
                  <strong>Seek Clarification:</strong> If you need clarification on any feedback, 
                  our support team is ready to assist you
                </li>
              </ul>
            </div>
            
            <div class="encouragement-box">
              <p class="encouragement-title">💪 Keep Going!</p>
              <p class="encouragement-text">
                Revisions are a normal part of the scholarly publishing process. Many excellent articles 
                go through multiple rounds of revision before publication. Your dedication to improving 
                your work is commendable, and we're here to support you throughout this process.
              </p>
            </div>
            
            <div class="cta-section">
              <a href="https://scientificjournalsportal.com/" class="cta-button">
                View Article in Dashboard
              </a>
              <a href="https://scientificjournalsportal.com/faq/authorfaq" class="secondary-button">
                Review Guidelines
              </a>
            </div>
            
            <div class="support-section">
              <p class="support-title">💬 Need Help?</p>
              <p class="support-text">
                Should you have any questions or require clarification on any points raised in the 
                feedback, please don't hesitate to 
                <a href="https://scientificjournalsportal.com/contact/new" class="support-link">reach out to our support team</a>. 
                We are here to support you throughout this revision process. You can also check our 
                <a href="https://scientificjournalsportal.com/faq/authorfaq" class="support-link">Author FAQ</a> 
                for additional guidance.
              </p>
            </div>
            
            <div class="signature">
              <p class="signature-text">
                Thank you for your understanding and cooperation. We truly value your contributions 
                and look forward to the possibility of reconsidering your article for publication 
                after the revisions.
              </p>
              <p class="signature-text" style="margin-top: 20px;">Warm regards,</p>
              <p class="signature-text">
                <a href="https://scientificjournalsportal.com/" style="color: #543a31; text-decoration: none; font-weight: 600;">
                  Scientific Journals Portal
                </a>
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p class="footer-text">
              This is an automated message from Scientific Journals Portal. 
              Please do not reply to this email directly.
            </p>
            <p class="footer-text">
              All communication regarding your submission should be directed through your dashboard 
              or our contact support system.
            </p>
            <p class="footer-brand">Scientific Journals Portal © ${new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Subscription payment successful email template
 * @param {string} userName - User's name or surname
 * @param {string} subscriptionPeriodStart - Subscription period start date (formatted)
 * @param {string} subscriptionPeriodEnd - Subscription period end date (formatted)
 * @param {string} invoiceUrl - Hosted invoice URL
 * @param {string} invoicePdf - Invoice PDF URL
 * @param {string} subscriptionAmount - Subscription amount (formatted with currency)
 * @returns {string} HTML email template
 */
export const subscriptionPaymentSuccessfulEmailTemplate = (
  userName,
  subscriptionPeriodStart,
  subscriptionPeriodEnd,
  invoiceUrl,
  invoicePdf,
  subscriptionAmount
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Subscription Payment Successful - Scientific Journals Portal</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.7;
          color: #2d3748;
          background-color: #f7fafc;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .email-wrapper {
          background-color: #f7fafc;
          padding: 40px 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #543a31 0%, #6b4f47 100%);
          padding: 40px 30px;
          text-align: center;
        }
        .logo-container {
          margin-bottom: 15px;
        }
        .logo-container img {
          max-width: 180px;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .header-title {
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-top: 10px;
        }
        .content {
          padding: 40px 30px;
        }
        .success-icon {
          text-align: center;
          font-size: 64px;
          margin-bottom: 20px;
        }
        .greeting {
          font-size: 22px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 20px;
        }
        .success-message {
          font-size: 18px;
          color: #22c55e;
          margin-bottom: 30px;
          font-weight: 600;
          text-align: center;
        }
        .message-text {
          font-size: 16px;
          color: #4a5568;
          margin-bottom: 16px;
          line-height: 1.8;
        }
        .info-box {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border-left: 4px solid #22c55e;
          padding: 20px;
          margin: 30px 0;
          border-radius: 6px;
        }
        .info-title {
          font-size: 16px;
          font-weight: 700;
          color: #065f46;
          margin-bottom: 10px;
        }
        .info-text {
          font-size: 15px;
          color: #047857;
          line-height: 1.7;
        }
        .subscription-details {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          padding: 30px;
          border-radius: 8px;
          margin: 30px 0;
        }
        .details-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 20px;
          text-align: center;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background-color: #ffffff;
          border-radius: 6px;
          margin-bottom: 12px;
          border-left: 4px solid #543a31;
        }
        .detail-label {
          font-size: 15px;
          font-weight: 600;
          color: #4a5568;
        }
        .detail-value {
          font-size: 15px;
          font-weight: 700;
          color: #1a202c;
          text-align: right;
        }
        .amount-highlight {
          font-size: 24px;
          color: #22c55e;
        }
        .button-container {
          text-align: center;
          margin: 35px 0;
        }
        .invoice-button {
          display: inline-block;
          padding: 16px 48px;
          background: linear-gradient(135deg, #543a31 0%, #6b4f47 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(84, 58, 49, 0.3);
          transition: all 0.3s ease;
          text-transform: uppercase;
          margin: 5px;
        }
        .invoice-button:hover {
          background: linear-gradient(135deg, #3d2a23 0%, #543a31 100%);
          box-shadow: 0 6px 16px rgba(84, 58, 49, 0.4);
          transform: translateY(-2px);
        }
        .pdf-button {
          display: inline-block;
          padding: 14px 36px;
          background-color: #ffffff;
          color: #543a31 !important;
          text-decoration: none;
          border: 2px solid #543a31;
          border-radius: 8px;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.5px;
          margin: 5px;
        }
        .pdf-button:hover {
          background-color: #f7fafc;
        }
        .support-section {
          background-color: #edf2f7;
          padding: 20px;
          border-radius: 8px;
          margin: 30px 0;
          border: 1px solid #cbd5e0;
        }
        .support-title {
          font-size: 14px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 10px;
        }
        .support-text {
          font-size: 13px;
          color: #4a5568;
          line-height: 1.7;
        }
        .support-link {
          color: #543a31;
          text-decoration: underline;
          font-weight: 600;
        }
        .signature {
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid #e2e8f0;
        }
        .signature-text {
          font-size: 15px;
          color: #4a5568;
          margin-bottom: 5px;
          font-weight: 500;
        }
        .footer {
          background-color: #f7fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-text {
          font-size: 13px;
          color: #718096;
          line-height: 1.6;
          margin-bottom: 10px;
        }
        .footer-brand {
          font-size: 14px;
          color: #543a31;
          font-weight: 600;
          margin-top: 15px;
        }
        @media only screen and (max-width: 600px) {
          .email-wrapper {
            padding: 20px 10px;
          }
          .header {
            padding: 30px 20px;
          }
          .content {
            padding: 30px 20px;
          }
          .header-title {
            font-size: 20px;
          }
          .greeting {
            font-size: 20px;
          }
          .success-message {
            font-size: 16px;
          }
          .invoice-button,
          .pdf-button {
            display: block;
            width: 100%;
            margin: 10px 0;
            text-align: center;
          }
          .detail-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .detail-value {
            text-align: left;
            margin-top: 5px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <div class="logo-container">
              <img src="https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/logo-removebg-preview.jpg" 
                   alt="Scientific Journals Portal Logo" />
            </div>
            <h1 class="header-title">Scientific Journals Portal</h1>
          </div>
          
          <!-- Content -->
          <div class="content">
            <div class="success-icon">✅</div>
            
            <p class="greeting">Hi ${userName},</p>
            
            <p class="success-message">🎉 Subscription Payment Successful!</p>
            
            <p class="message-text">
              Thank you for your subscription payment! Your payment has been successfully processed 
              and your subscription is now active. We're excited to have you as part of our community.
            </p>
            
            <div class="info-box">
              <p class="info-title">✨ Your Subscription is Active</p>
              <p class="info-text">
                You now have full access to all subscription benefits. Enjoy unlimited access to our 
                premium content and features throughout your subscription period.
              </p>
            </div>
            
            <div class="subscription-details">
              <h2 class="details-title">Subscription Details</h2>
              
              <div class="detail-row">
                <span class="detail-label">Subscription Period:</span>
                <span class="detail-value">${subscriptionPeriodStart} - ${subscriptionPeriodEnd}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Amount Paid:</span>
                <span class="detail-value amount-highlight">${subscriptionAmount}</span>
              </div>
            </div>
            
            <div class="button-container">
              <a href="${invoiceUrl}" class="invoice-button" target="_blank">
                View Invoice Online
              </a>
              ${invoicePdf ? `<a href="${invoicePdf}" class="pdf-button" target="_blank">Download PDF Invoice</a>` : ''}
            </div>
            
            <div class="support-section">
              <p class="support-title">💬 Need Assistance?</p>
              <p class="support-text">
                If you have any questions about your subscription or need help accessing your account, 
                please don't hesitate to 
                <a href="https://scientificjournalsportal.com/contact/new" class="support-link">contact our support team</a>. 
                We're here to help!
              </p>
            </div>
            
            <div class="signature">
              <p class="signature-text">Thank you for choosing Scientific Journals Portal.</p>
              <p class="signature-text">Best Regards,</p>
              <p class="signature-text">
                <a href="https://scientificjournalsportal.com/" style="color: #543a31; text-decoration: none; font-weight: 600;">
                  Scientific Journals Team
                </a>
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p class="footer-text">
              This is an automated confirmation email from Scientific Journals Portal. 
              Please keep this email for your records.
            </p>
            <p class="footer-text">
              All subscription-related communications will be sent to this email address. 
              Please ensure your email is active and check your spam folder if you don't receive updates.
            </p>
            <p class="footer-brand">Scientific Journals Portal © ${new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * RISE Investment payment confirmation email template
 * @param {string} investorName - Investor's name
 * @param {string} investorEmail - Investor's email address
 * @param {string} receiptUrl - Invoice/receipt URL
 * @returns {string} HTML email template
 */
export const riseInvestmentConfirmationTemplate = (
  investorName,
  investorEmail,
  receiptUrl
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Investment Confirmation - RISE</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
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
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
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
        .header-subtitle {
          color: #ffffff;
          font-size: 16px;
          font-weight: 400;
          margin-top: 10px;
          opacity: 0.95;
        }
        .content {
          padding: 40px 30px;
          background-color: #ffffff;
          color: #1a202c;
        }
        .success-icon {
          text-align: center;
          font-size: 72px;
          margin-bottom: 20px;
        }
        .greeting {
          font-size: 24px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 20px;
          text-align: center;
        }
        .success-message {
          font-size: 20px;
          color: #22c55e;
          margin-bottom: 30px;
          font-weight: 600;
          text-align: center;
        }
        .message-text {
          font-size: 16px;
          color: #1a202c;
          margin-bottom: 16px;
          line-height: 1.8;
          text-align: center;
        }
        .info-box {
          background-color: #ecfdf5;
          border-left: 4px solid #22c55e;
          padding: 25px;
          margin: 30px 0;
          border-radius: 8px;
          text-align: center;
        }
        .info-title {
          font-size: 18px;
          font-weight: 700;
          color: #065f46;
          margin-bottom: 12px;
        }
        .info-text {
          font-size: 15px;
          color: #047857;
          line-height: 1.7;
        }
        .confirmation-box {
          background-color: #f7fafc;
          padding: 30px;
          border-radius: 8px;
          margin: 30px 0;
          text-align: center;
        }
        .confirmation-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 20px;
        }
        .confirmation-text {
          font-size: 16px;
          color: #1a202c;
          line-height: 1.8;
          margin-bottom: 20px;
        }
        .highlight-text {
          font-size: 18px;
          font-weight: 600;
          color: #1a202c;
          margin: 20px 0;
          padding: 15px;
          background-color: #f7fafc;
          border-radius: 6px;
          border: 2px solid #2A3C5A;
        }
        .button-container {
          text-align: center;
          margin: 35px 0;
        }
        .receipt-button {
          display: inline-block;
          padding: 16px 48px;
          background-color: #2A3C5A;
          color: #ffffff !important;
          text-decoration: none !important;
          border-radius: 8px;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          border: none;
        }
        .receipt-button:hover {
          background-color: #1F2F4C;
        }
        .receipt-link {
          color: #2A3C5A !important;
          text-decoration: underline !important;
          font-weight: 600;
          word-break: break-all;
        }
        .next-steps {
          background-color: #fff9e6;
          border: 1px solid #f6e05e;
          border-radius: 8px;
          padding: 25px;
          margin: 30px 0;
        }
        .steps-title {
          font-size: 18px;
          font-weight: 700;
          color: #744210;
          margin-bottom: 15px;
          text-align: center;
        }
        .steps-text {
          font-size: 15px;
          color: #744210;
          line-height: 1.7;
          text-align: center;
        }
        .support-section {
          background-color: #edf2f7;
          padding: 20px;
          border-radius: 8px;
          margin: 30px 0;
          border: 1px solid #cbd5e0;
          text-align: center;
        }
        .support-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 10px;
        }
        .support-text {
          font-size: 14px;
          color: #1a202c;
          line-height: 1.7;
        }
        .support-link {
          color: #2A3C5A;
          text-decoration: underline;
          font-weight: 600;
        }
        .signature {
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
        }
        .signature-text {
          font-size: 15px;
          color: #1a202c;
          margin-bottom: 5px;
          font-weight: 500;
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
          margin-bottom: 10px;
        }
        .footer-brand {
          font-size: 14px;
          color: #2A3C5A;
          font-weight: 600;
          margin-top: 15px;
        }
        @media only screen and (max-width: 600px) {
          .email-wrapper {
            padding: 20px 10px;
          }
          .header {
            padding: 40px 20px;
          }
          .content {
            padding: 30px 20px;
          }
          .header-title {
            font-size: 24px;
          }
          .greeting {
            font-size: 20px;
          }
          .success-message {
            font-size: 18px;
          }
          .receipt-button {
            padding: 14px 32px;
            font-size: 14px;
            width: 100%;
            display: block;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <h1 class="header-title">RISE</h1>
            <p class="header-subtitle">Right Intellectual Services Enterprise</p>
          </div>
          
          <!-- Content -->
          <div class="content">
            <div class="success-icon">✅</div>
            
            <p class="greeting">Dear ${investorName},</p>
            
            <p class="success-message">🎉 Investment Payment Successful!</p>
            
            <p class="message-text">
              Thank you for your investment in RISE. Your payment has been processed successfully.
            </p>
            
            <div class="info-box">
              <p class="info-title">✨ Investment Confirmed</p>
              <p class="info-text">
                We acknowledge your contribution and will be in touch within 48 hours to discuss 
                further contact and formalities regarding your investment.
              </p>
            </div>
            
            <div class="confirmation-box">
              <p class="confirmation-title">Investment Details</p>
              <p class="confirmation-text">
                Your investment has been successfully recorded in our system. You will receive 
                formal documentation and next steps from our team shortly.
              </p>
              ${receiptUrl ? `
                <div class="highlight-text">
                  📄 Your receipt is available below
                </div>
              ` : ''}
            </div>
            
            ${receiptUrl ? `
              <div class="button-container">
                <a href="${receiptUrl}" class="receipt-button" target="_blank" style="display: inline-block; padding: 16px 48px; background-color: #2A3C5A; color: #ffffff !important; text-decoration: none !important; border-radius: 8px; font-weight: 700; font-size: 16px; letter-spacing: 0.5px; text-transform: uppercase;">
                  View Receipt
                </a>
              </div>
              <div style="text-align: center; margin-top: 15px;">
                <p style="font-size: 14px; color: #1a202c; margin-bottom: 10px;">Or click this link:</p>
                <a href="${receiptUrl}" class="receipt-link" target="_blank" style="color: #2A3C5A !important; text-decoration: underline !important; font-weight: 600; word-break: break-all;">
                  ${receiptUrl}
                </a>
              </div>
            ` : ''}
            
            <div class="next-steps">
              <p class="steps-title">⏰ What Happens Next?</p>
              <p class="steps-text">
                Our team will contact you within 48 hours to acknowledge your contribution and 
                discuss the next steps in the investment process. Please keep this confirmation 
                email for your records.
              </p>
            </div>
            
            <div class="support-section">
              <p class="support-title">💬 Need Assistance?</p>
              <p class="support-text">
                If you have any questions about your investment or need to contact us, 
                please don't hesitate to reach out. We're here to help!
              </p>
            </div>
            
            <div class="signature">
              <p class="signature-text">Thank you for choosing RISE.</p>
              <p class="signature-text">Best Regards,</p>
              <p class="signature-text" style="font-weight: 600; color: #2A3C5A;">
                RISE Investment Team
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p class="footer-text">
              This is an automated confirmation email from RISE (Right Intellectual Services Enterprise). 
              Please keep this email for your records.
            </p>
            <p class="footer-text">
              All investment-related communications will be sent to this email address. 
              Please ensure your email is active and check your spam folder if you don't receive updates.
            </p>
            <p class="footer-brand">RISE © ${new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Reviewer approval email template
 * @param {string} name - Reviewer's name
 * @param {string} email - Reviewer's email address
 * @returns {string} HTML email template
 */
export const reviewerApprovalTemplate = (name, email) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Reviewer Application Approved - Scientific Journals Portal</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.7;
          color: #2d3748;
          background-color: #f7fafc;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .email-wrapper {
          background-color: #f7fafc;
          padding: 40px 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #543a31 0%, #6b4f47 100%);
          padding: 40px 30px;
          text-align: center;
        }
        .logo-container {
          margin-bottom: 15px;
        }
        .logo-container img {
          max-width: 180px;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .header-title {
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-top: 10px;
        }
        .content {
          padding: 40px 30px;
        }
        .success-icon {
          text-align: center;
          font-size: 64px;
          margin-bottom: 20px;
        }
        .greeting {
          font-size: 22px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 20px;
        }
        .success-message {
          font-size: 18px;
          color: #22c55e;
          margin-bottom: 30px;
          font-weight: 600;
          text-align: center;
        }
        .message-text {
          font-size: 16px;
          color: #4a5568;
          margin-bottom: 16px;
          line-height: 1.8;
        }
        .info-box {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border-left: 4px solid #22c55e;
          padding: 20px;
          margin: 30px 0;
          border-radius: 6px;
        }
        .info-title {
          font-size: 16px;
          font-weight: 700;
          color: #065f46;
          margin-bottom: 10px;
        }
        .info-text {
          font-size: 15px;
          color: #047857;
          line-height: 1.7;
        }
        .cta-section {
          text-align: center;
          margin: 35px 0;
        }
        .cta-button {
          display: inline-block;
          padding: 16px 48px;
          background: linear-gradient(135deg, #543a31 0%, #6b4f47 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(84, 58, 49, 0.3);
          transition: all 0.3s ease;
          text-transform: uppercase;
        }
        .cta-button:hover {
          background: linear-gradient(135deg, #3d2a23 0%, #543a31 100%);
          box-shadow: 0 6px 16px rgba(84, 58, 49, 0.4);
          transform: translateY(-2px);
        }
        .signature {
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid #e2e8f0;
        }
        .signature-text {
          font-size: 15px;
          color: #4a5568;
          margin-bottom: 5px;
          font-weight: 500;
        }
        .footer {
          background-color: #f7fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-text {
          font-size: 13px;
          color: #718096;
          line-height: 1.6;
          margin-bottom: 10px;
        }
        .footer-brand {
          font-size: 14px;
          color: #543a31;
          font-weight: 600;
          margin-top: 15px;
        }
        @media only screen and (max-width: 600px) {
          .email-wrapper {
            padding: 20px 10px;
          }
          .header {
            padding: 30px 20px;
          }
          .content {
            padding: 30px 20px;
          }
          .header-title {
            font-size: 20px;
          }
          .greeting {
            font-size: 20px;
          }
          .success-message {
            font-size: 16px;
          }
          .cta-button {
            padding: 14px 32px;
            font-size: 14px;
            width: 100%;
            display: block;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <div class="logo-container">
              <img src="https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/logo-removebg-preview.jpg" 
                   alt="Scientific Journals Portal Logo" />
            </div>
            <h1 class="header-title">Scientific Journals Portal</h1>
          </div>
          
          <!-- Content -->
          <div class="content">
            <div class="success-icon">🎉</div>
            
            <p class="greeting">Hi ${name}!</p>
            
            <p class="success-message">Your Reviewer Application Has Been Approved!</p>
            
            <p class="message-text">
              We are pleased to inform you that your reviewer application has been reviewed and approved 
              by our editorial team. Welcome to the Scientific Journals Portal reviewer community!
            </p>
            
            <div class="info-box">
              <p class="info-title">✨ What's Next?</p>
              <p class="info-text">
                You can now log in to your account and start reviewing manuscripts. Your expertise and 
                contributions are valuable to maintaining the quality and integrity of our publications.
              </p>
            </div>
            
            <div class="cta-section">
              <a href="https://scientificjournalsportal.com/login" class="cta-button">
                Log In to Your Account
              </a>
            </div>
            
            <p class="message-text">
              Thank you for your interest in contributing to the scientific community through peer review. 
              We look forward to working with you!
            </p>
            
            <div class="signature">
              <p class="signature-text">Best Regards,</p>
              <p class="signature-text">
                <a href="https://scientificjournalsportal.com/" style="color: #543a31; text-decoration: none; font-weight: 600;">
                  Scientific Journals Portal Editorial Team
                </a>
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p class="footer-text">
              This is an automated message from Scientific Journals Portal. 
              Please do not reply to this email.
            </p>
            <p class="footer-text">
              If you have any questions, please contact our support team through your dashboard.
            </p>
            <p class="footer-brand">Scientific Journals Portal © ${new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};


export const newUserRegistrationNotificationTemplate = (
  userType,
  email,
  title,
  surname,
  otherName,
  affiliation,
  country,
  isReviewer,
  cvUrl
) => {
  const fullName = `${title || ''} ${surname || ''} ${otherName || ''}`.trim();
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>New User Registration - Scientific Journals Portal</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.7;
          color: #2d3748;
          background-color: #f7fafc;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .email-wrapper {
          background-color: #f7fafc;
          padding: 40px 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #543a31 0%, #6b4f47 100%);
          padding: 40px 30px;
          text-align: center;
        }
        .logo-container {
          margin-bottom: 15px;
        }
        .logo-container img {
          max-width: 180px;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .header-title {
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-top: 10px;
        }
        .content {
          padding: 40px 30px;
        }
        .notification-icon {
          text-align: center;
          font-size: 64px;
          margin-bottom: 20px;
        }
        .greeting {
          font-size: 22px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 20px;
        }
        .message-text {
          font-size: 16px;
          color: #4a5568;
          margin-bottom: 16px;
          line-height: 1.8;
        }
        .info-box {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          padding: 25px;
          border-radius: 8px;
          margin: 30px 0;
          border: 1px solid #e2e8f0;
        }
        .info-title {
          font-size: 18px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 15px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-size: 15px;
          font-weight: 600;
          color: #4a5568;
        }
        .info-value {
          font-size: 15px;
          color: #1a202c;
          text-align: right;
        }
        .reviewer-notice {
          background: linear-gradient(135deg, #fff5f5 0%, #fef5e7 100%);
          border-left: 4px solid #f59e0b;
          padding: 20px;
          margin: 30px 0;
          border-radius: 6px;
        }
        .reviewer-title {
          font-size: 16px;
          font-weight: 700;
          color: #92400e;
          margin-bottom: 10px;
        }
        .reviewer-text {
          font-size: 15px;
          color: #78350f;
          line-height: 1.7;
        }
        .cv-link {
          color: #543a31;
          text-decoration: underline;
          font-weight: 600;
        }
        .footer {
          background-color: #f7fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-text {
          font-size: 13px;
          color: #718096;
          line-height: 1.6;
          margin-bottom: 10px;
        }
        .footer-brand {
          font-size: 14px;
          color: #543a31;
          font-weight: 600;
          margin-top: 15px;
        }
        @media only screen and (max-width: 600px) {
          .email-wrapper {
            padding: 20px 10px;
          }
          .header {
            padding: 30px 20px;
          }
          .content {
            padding: 30px 20px;
          }
          .header-title {
            font-size: 20px;
          }
          .greeting {
            font-size: 20px;
          }
          .info-row {
            flex-direction: column;
          }
          .info-value {
            text-align: left;
            margin-top: 5px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <div class="logo-container">
              <img src="https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/logo-removebg-preview.jpg" 
                   alt="Scientific Journals Portal Logo" />
            </div>
            <h1 class="header-title">Scientific Journals Portal</h1>
          </div>
          
          <!-- Content -->
          <div class="content">
            <div class="notification-icon">📧</div>
            
            <p class="greeting">New User Registration</p>
            
            <p class="message-text">
              A new user has registered on the Scientific Journals Portal. Please find the registration details below:
            </p>
            
            <div class="info-box">
              <p class="info-title">User Registration Details</p>
              
              <div class="info-row">
                <span class="info-label">User Type:</span>
                <span class="info-value"><strong>${userType === 'reviewer' ? 'Reviewer' : 'User'}</strong></span>
              </div>
              
              <div class="info-row">
                <span class="info-label">Name:</span>
                <span class="info-value">${fullName || 'N/A'}</span>
              </div>
              
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${email}</span>
              </div>
              
              <div class="info-row">
                <span class="info-label">Affiliation:</span>
                <span class="info-value">${affiliation || 'N/A'}</span>
              </div>
              
              <div class="info-row">
                <span class="info-label">Country:</span>
                <span class="info-value">${country || 'N/A'}</span>
              </div>
              
              <div class="info-row">
                <span class="info-label">Registration Date:</span>
                <span class="info-value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
            
            ${isReviewer ? `
            <div class="reviewer-notice">
              <p class="reviewer-title">⚠️ Reviewer Application</p>
              <p class="reviewer-text">
                This user has registered as a <strong>Reviewer</strong> and requires admin approval before they can access the system.
                ${cvUrl ? `<br /><br />CV: <a href="${cvUrl}" class="cv-link" target="_blank">View CV</a>` : ''}
                <br /><br />
                Please review their application in the Reviewer Management section of the admin dashboard.
              </p>
            </div>
            ` : ''}
            
            <p class="message-text">
              You can manage this user and their registration status through the admin dashboard.
            </p>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p class="footer-text">
              This is an automated notification from Scientific Journals Portal. 
              Please do not reply to this email.
            </p>
            <p class="footer-brand">Scientific Journals Portal © ${new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};