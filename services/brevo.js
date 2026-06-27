const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// ============================================================
// Generic Email Sender
// ============================================================
async function sendEmail({
  to,
  toName,
  subject,
  html,
  replyTo = null,
}) {
  const emailData = {
    sender: {
      name: "SyedFlights",
      email: "syedimranshah695@gmail.com",
    },

    to: [
      {
        email: to,
        name: toName || "",
      },
    ],

    subject,

    htmlContent: html,
  };

  if (replyTo) {
    emailData.replyTo = replyTo;
  }

  return apiInstance.sendTransacEmail(emailData);
}

module.exports = sendEmail;