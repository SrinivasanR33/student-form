// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIxWGET8PvZ73B8-7NpdQMedSRVPtNExE",
  authDomain: "student-form-bd584.firebaseapp.com",
  projectId: "student-form-bd584",
  storageBucket: "student-form-bd584.firebasestorage.app",
  messagingSenderId: "785687225814",
  appId: "1:785687225814:web:110bf9c52a31912ca47077",
  measurementId: "G-WT0MDN60C8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);