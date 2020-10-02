var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com ',
    port: 465,
    auth: {
        user: 'lab.final.ad@gmail.com',
        pass: '@lab_1234'
    }
});

function createBodyEmail(email){

    var mailOptions = {
        from: 'lab.final.ad@gmail.com',
        to:  email,
        subject: 'Informe sobre Pixeles',
        text: 'Se adjunta pdf',
        attachments: [{
          filename: 'file.pdf',
          path: './informe.pdf',
          contentType: 'application/pdf'
        }]
    };

    return mailOptions;
}

module.exports.sendEmail =  function sendEmail(email){
    transporter.sendMail(createBodyEmail(email), function(error, info){
        if (error){
            console.log(error);
        } else {
            console.log("Email sent");
            
         }
    })
}