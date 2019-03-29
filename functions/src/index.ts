import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp(functions.config().firebase)

/* ---- sendNotifications ---- */
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'sendNotifications') {
    const sendNotifications = require('./sendNotifications');
    module.exports.sendNotifications = sendNotifications.sendNotifications;
}