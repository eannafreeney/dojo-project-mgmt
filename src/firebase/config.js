import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCW0unHiYRMgN7VtVbgukHYmZmVlqZ3ooE",
  authDomain: "the-dojo-project-manager.firebaseapp.com",
  projectId: "the-dojo-project-manager",
  storageBucket: "the-dojo-project-manager.appspot.com",
  messagingSenderId: "200789530025",
  appId: "1:200789530025:web:99d4d006215fbbc3b1e0b8",
};

// init firebase
firebase.initializeApp(firebaseConfig);

// init services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();

// timestamp
const timestamp = firebase.firestore.Timestamp;

export { projectFirestore, projectAuth, projectStorage, timestamp };
