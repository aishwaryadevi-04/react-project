import firebase from 'firebase/app';
import 'firebase/auth';
import { initializeApp } from "firebase/app";
import {getAuth, onAuthStateChanged} from "firebase/auth"
import { getDatabase } from "firebase/database";
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyALkVQPKExwSx9HKdsZzL-G7i97f2Pz7-k",
  authDomain: "react-project-72e50.firebaseapp.com",
  projectId: "react-project-72e50",
  storageBucket: "react-project-72e50.appspot.com",
  messagingSenderId: "429479927357",
  appId: "1:429479927357:web:1b735816dcdfd2f03ed454",
  measurementId: "G-9R7E2Q88DG"
};


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

onAuthStateChanged(auth, user => {
  if (user) {
    console.log("Authentication database has users");
    return true;
  } else {
    console.log("Authentication database is empty");
    return false;
  }
});


export { firebaseApp, auth, database,onAuthStateChanged,db };