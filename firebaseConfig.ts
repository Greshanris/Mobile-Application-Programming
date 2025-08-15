// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdrCnyjCm7_cL3WWsKbtmi7nPjNSucfAI",
  authDomain: "groupsync-1c991.firebaseapp.com",
  databaseURL: "https://groupsync-1c991-default-rtdb.firebaseio.com",
  projectId: "groupsync-1c991",
  storageBucket: "groupsync-1c991.firebasestorage.app",
  messagingSenderId: "988863899953",
  appId: "1:988863899953:web:2e5fa5cddde0b919eb2810",
  measurementId: "G-HEMDN035XE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)