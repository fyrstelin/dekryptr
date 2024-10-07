import { initializeApp } from 'firebase/app'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBydY-r1umo4m1bY4cuZl6NJTwXdGDvs2E",
  authDomain: "dekryptr.firebaseapp.com",
  projectId: "dekryptr",
  storageBucket: "dekryptr.appspot.com",
  messagingSenderId: "730386670463",
  appId: "1:730386670463:web:629bde604fe66df942f04a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);