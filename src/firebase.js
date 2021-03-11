import firebase from 'firebase';


const firebaseApp =  firebase.initializeApp({
    apiKey: "AIzaSyAXBaRdX406oyYLKX49RDwfy2s6hkhffx8",
    authDomain: "jons-instagram-clone.firebaseapp.com",
    projectId: "jons-instagram-clone",
    storageBucket: "jons-instagram-clone.appspot.com",
    messagingSenderId: "571091741907",
    appId: "1:571091741907:web:49020faf8b5be6a4687826",
    measurementId: "G-7BLFYC68T1"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage };