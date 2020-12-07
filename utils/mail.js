const util = require('util');
const fs = require('fs');
const path = require('path');
const sendMail = require('@sendgrid/mail');
const handlebars = require('handlebars');
const { mail } = require('../config');

const readFile = util.promisify(fs.readFile);
sendMail.setApiKey(mail.api_key);

module.exports = async ({ to, subject, type, parameters }) => {
  try {
    const html = await readFile(
      path.join(process.cwd(), 'email-templates', `${type}.hbs`),
      'utf8'
    );
    const template = handlebars.compile(html);
    const response = await sendMail.send({
      to: to,
      from: {
        name: 'your-app',
        email: mail.from,
      },
      subject: subject,
      text: 'your-app emailing service',
      html: template(parameters),
    });
    return {
      status: true,
      message: response,
    };
  } catch (err) {
    return {
      status: false,
      message: err.toString(),
    };
  }
};
