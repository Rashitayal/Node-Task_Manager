const sgMail = require('@sendgrid/mail');
const sendGridApiKey = process.env.SENDGRIDAPIKEY; 

sgMail.setApiKey(sendGridApiKey);

const welcomeDocument = (email,name) => {
    sgMail
    .send({
        to:email,
        from:'rashitayal110994@gmail.com',
        subject:'thanks for joining us!',
        text: `${name} Welcome to the app.`
    })
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

module.exports = {
    welcomeDocument
}