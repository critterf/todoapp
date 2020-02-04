import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyDSaZ4QrLfuFiknKZNw3KkF1GcHpkzhuKw",
  authDomain: "authenticationapp-1545b.firebaseapp.com",
  databaseURL: "https://authenticationapp-1545b.firebaseio.com",
  projectId: "authenticationapp-1545b",
  storageBucket: "authenticationapp-1545b.appspot.com",
  messagingSenderId: "556207487913",
  appId: "1:556207487913:web:f2ccd84697f5d81f2262b8"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();
