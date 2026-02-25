import nodemailer from 'nodemailer'

import "dotenv/config"


export const sendOTPMail = async(otp , email)=>{


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
    subject: 'Password reset OTP',
    
    html:`<p>Your OTP for Password reset is ${otp}</p>`
    };

    mailTransporter
    .sendMail(mailDetails,
        function (err, data) {
            if (err) {
                console.log('Error Occurs');
            } else {
                console.log('OTP sent successfully');
            }
        });
}



