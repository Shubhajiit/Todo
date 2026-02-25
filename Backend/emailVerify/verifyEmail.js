import nodemailer from 'nodemailer'

import "dotenv/config"


export const verifyEmail =(token , email)=>{


    const mailTransporter =
    nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        }
    );

    const mailDetails = {
    from: 'process.env.MAIL_USER',
    to: email,
    subject: 'Email Verification',
    text: `Hi there , we are recently visited our website , 
    Please follow the given link to verify the email
    http://localhost:5173/verify/${token}
    Thanks
    `
    };

    mailTransporter
    .sendMail(mailDetails,
        function (err, data) {
            if (err) {
                console.log('Error Occurs');
            } else {
                console.log('Email sent successfully');
            }
        });
}



