import * as functions from 'firebase-functions'
import * as nodemailer from 'nodemailer'
const gmailEmail = functions.config().gmail.email
const gmailPassword = functions.config().gmail.password
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword
    }
})

export const sendMail = functions
//.region('asia-northeast1')
.https.onCall((data, context) => {
    try {
        const email = {
            from: gmailEmail,
            to: data.destination,
            subject: data.subject,
            text: data.text,
        }
        mailTransport.sendMail(email, (err, info) => {
            if (err) {
                return err
            }
            return info
        })
    } catch ( error ) {
        return error
    }
})
