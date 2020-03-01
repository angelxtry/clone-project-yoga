import * as Mailgun from 'mailgun-js';

const mailGunClient = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY || '',
  domain: 'sandbox13ab902a69ca455d8105e81654df7cea.mailgun.org',
});

const sendEmail = (subject: string, html: string) => {
  const emailData: Mailgun.messages.SendData = {
    from: 'angelxtry@gmail.com',
    to: 'angelxtry@gmail.com',
    subject,
    html,
  };
  return mailGunClient.messages().send(emailData);
};

const sendVerificationEmail = (fullName: string, key: string) => {
  const emailSubject = `Hello! ${fullName}. Please verify your email.`;
  // eslint-disable-next-line max-len
  const emailBody = `Verify your email by click <a href="http://abc.abc/verification/${key}/">here</a>`;
  return sendEmail(emailSubject, emailBody);
};

export default sendVerificationEmail;
