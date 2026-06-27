const { setDefaultHighWaterMark } = require("nodemailer/lib/xoauth2");
const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;

client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

async function sendEmail({ name, email, subject, message }) {
  const emailData = {
    sender: {
      name: "Syedflights",
      email: "syedimranshah695@gmail.com"
    },

    to: [
      {
        email: "syedimranshah695@gmail.com",
        name: "syed imran shah"
      }
    ],

    subject: `📩 New Contact Form: ${subject}`,

    htmlContent: `
      <h2>New Contact Form Submission</h2>

      <p><strong>Name:</strong> ${name}</p>

      <p><strong>Email:</strong> ${email}</p>

      <p><strong>Subject:</strong> ${subject}</p>

      <hr>

      <p>${message}</p>
    `
  };

  return apiInstance.sendTransacEmail(emailData);
}

module.exports = sendEmail;