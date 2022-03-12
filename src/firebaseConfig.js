// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth, createUserWithEmailAndPassword,
    updateProfile, signInWithEmailAndPassword,
    onAuthStateChanged, signOut
} from "firebase/auth";
import { getDatabase, set, ref, push, onChildAdded, onChildChanged, onChildRemoved, onValue, child } from "firebase/database";
import { getStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { GoogleAuthProvider ,signInWithPopup} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBZxbPtcV4ZM8kjvYqLHDhel-usqPjyUAk",
    authDomain: "first-chatting-app-dee38.firebaseapp.com",
    projectId: "first-chatting-app-dee38",
    storageBucket: "first-chatting-app-dee38.appspot.com",
    messagingSenderId: "915015279563",
    appId: "1:915015279563:web:ab065f323a3bf5ab478c4e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);
const storage = getStorage(app);

export {
    auth, createUserWithEmailAndPassword,
    updateProfile, db, ref, set,
    signInWithEmailAndPassword,
    onAuthStateChanged, signOut, push, getDatabase,
    onChildAdded, onChildChanged, onChildRemoved,
    onValue, child, storage, getStorage, uploadBytesResumable, getDownloadURL,getAuth,GoogleAuthProvider,signInWithPopup

}