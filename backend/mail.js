// const nodemailer = require('nodemailer');
// require('dotenv').config();

// // Create a transporter object using the Outlook SMTP transport
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   host: 'smtp.gmail.com',
//   port: 587,                    // SMTP port for TLS/STARTTLS
//   secure: false,                // Use TLS
//   auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD
//   }
// });

// const sendEmail = async (transporter, mailOptions) => {
//   try {
//     let info = await transporter.sendMail(mailOptions);
//     console.log('Message sent: %s', info.messageId);
//     return info;
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw error; // Rethrow to handle it in the caller
//   }
// };

// module.exports = {
//   sendEmail
// };