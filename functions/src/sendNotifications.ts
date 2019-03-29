import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const sendNotifications = functions
.region('asia-northeast1')
.https.onRequest(async(req, res) => {
    res.header('Access-Control-Allow-Origin', "*")
    try {
        // 通知のJSON
        const token = req.query.token
        const title = req.query.title
        const body = req.query.body
        const payload = {
            notification: {
            title,
            body,
            badge: "1",
            sound:"default",
            }
        };

        // tokenが欲しい
        pushToDevice(token, payload);
    }catch(error) {
        console.error(error)
    }
    res.send("OK")
})

// 特定のfcmTokenに対してプッシュ通知を打つ
function pushToDevice(token: string, payload: any){
    console.log("pushToDevice:", token);
  
    // priorityをhighにしとくと通知打つのが早くなる
    const options = {
      priority: "high",
    };
  
    admin.messaging().sendToDevice(token, payload, options)
    .then(pushResponse => {
      console.log("Successfully sent message:", pushResponse);
    })
    .catch(error => {
      console.log("Error sending message:", error);
    });
}