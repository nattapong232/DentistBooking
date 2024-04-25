const nodemailer = require("nodemailer");

exports.sendConfirmationEmail = async (req, res, next) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587, // SMTP port for TLS/STARTTLS
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Laewtae Dental Clinic 🦷" <evilpickle.go2.isef@gmail.com>',
    to: req.user.email,
    subject: "Dental Booking Confirmation",
    html: `<h2>Dear Khun ${req.user.name}</h2>
        <br>
        <h3>Your booking on ${req.booking.apptDate} with ${req.dentist.name} has been confirmed.</h3>
        <br>
        <b>Best regard</b>
        <br>
        <b>Laewtae Dental Clinic</b>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Sent");
  } catch (error) {
    console.log(error);
  }
};
