import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDc2geyO-CUmlV6nCYdZfZtPVOtngphfXM",
  authDomain: "chat-app-8a91d.firebaseapp.com",
  projectId: "chat-app-8a91d",
  storageBucket: "chat-app-8a91d.appspot.com",
  messagingSenderId: "922530453636",
  appId: "1:922530453636:web:39a16c0231adc64d448ad1",
  measurementId: "G-1L1008X2PQ",
};

const app = firebase.apps.length
  ? firebase.app()
  : firebase.initializeApp(firebaseConfig);

const db = app.firestore();

export default db;
