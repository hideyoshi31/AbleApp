import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp(functions.config().firebase)
// admin.initializeApp({credential: admin.credential.applicationDefault(),})
  
/* ---- sendNotifications ---- */
// if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'sendNotifications') {
//     const sendNotifications = require('./sendNotifications');
//     module.exports.sendNotifications = sendNotifications.sendNotifications;
// }

/* ---- sendEmail ---- */
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'sendMail') {
    const sendMail = require('./sendMail');
    module.exports.sendMail = sendMail.sendMail;
}
