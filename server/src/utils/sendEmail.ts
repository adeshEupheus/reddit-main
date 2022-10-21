"use strict";
// import nodemailer from "";
import nodemailer from "nodemailer";

export async function SendEmail(to: string, html: string) {
  let testAccount = await nodemailer.createTestAccount();
  console.log(testAccount);

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "f4rhfpczmeztzq66@ethereal.email", // generated ethereal user
      pass: "dA58UnhJH2V29UX9kD", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: to, // list of receivers
    subject: "Change Password", // Subject line
    // text: "Hello world?", // plain text body
    html, // html body
  });
  //   console.log("test");

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
