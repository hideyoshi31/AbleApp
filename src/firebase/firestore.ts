import firebase from 'firebase' 

const config = {
    apiKey: "AIzaSyB_VccGIxfHehOZv1tJq4dk8RxkfabLuuc",
    authDomain: "ableapp-ed7f6.firebaseapp.com",
    databaseURL: "https://ableapp-ed7f6.firebaseio.com",
    projectId: "ableapp-ed7f6",
    storageBucket: "ableapp-ed7f6.appspot.com",
    messagingSenderId: "280433767930"
};

firebase.initializeApp(config);

export default firebase