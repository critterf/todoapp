import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyCVJd25NSEYlrvdLr3fNn2dkjFhH0uBDsU",
  authDomain: "todoapp-67960.firebaseapp.com",
  databaseURL: "https://todoapp-67960.firebaseio.com",
  projectId: "todoapp-67960",
  storageBucket: "todoapp-67960.appspot.com",
  messagingSenderId: "231772212044",
  appId: "1:231772212044:web:8f5e1e071dc586237adde9"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();
