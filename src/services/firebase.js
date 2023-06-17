import { initializeApp, getApp, getApps } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  where,
  deleteDoc,
} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_PUBLIC_FIREBASE_APP_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

async function loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    const { user } = await signInWithPopup(auth, provider);

    return {
      uid: user.uid,
      displayName: user.displayName,
      displayPicture: user.photoURL,
      email: user.email,
    };
  } catch (error) {
    if (error.code !== "auth/cancelled-popup-request") {
      console.error(error);
    }

    return null;
  }
}

//Write message document to firestore
async function sendMessage(channelId, user, text) {
  try {
    const docRef = await addDoc(
      collection(db, "chat-channels", channelId, "messages"),
      {
        uid: user.uid,
        displayName: user.displayName,
        text: text.trim(),
        timestamp: serverTimestamp(),
        displayPicture: user.photoURL,
      }
    );
    return docRef;
  } catch (error) {
    console.error(error);
  }
}
// Create member document in firestor
async function createMember(member) {
  try {
    const memberDocRef = await addDoc(collection(db, "members"), member);
    return memberDocRef;
  } catch (error) {
    console.log(error);
  }
}
async function createUser(user) {
  try {
    const userDocRef = await addDoc(collection(db, "userData"), user);
    return userDocRef;
  } catch (error) {
    console.log(error);
  }
}

async function queryUser(param, paramvalue) {
  const colRef = query(
    collection(db, "members"),
    where(param, "==", paramvalue)
  );
  try {
    const docsSnap = await getDocs(colRef);
    return docsSnap;
  } catch (error) {
    console.log(error);
  }
}
//Reply message
function replyMessage(channelId, messageId, replies) {
  const messageRef = doc(db, "chat-channels", channelId, "messages", messageId);
  updateDoc(messageRef, {
    replies: replies,
  });
}
//delete message
function deleteMessage(channelId, messageId) {
  const messageRef = doc(db, "chat-channels", channelId, "messages", messageId);
  deleteDoc(messageRef);
}
// update user subcsription status
async function updateUser(param, paramvalue, assign) {
  const colRef = await queryUser(param, paramvalue);
  const userRef = doc(db, "members", colRef.docs[0].id);

  const updateRef = await updateDoc(userRef, { subscribed: assign });
  if (updateRef) {
    return true;
  } else {
    return false;
  }
}

// Read messages documents from firestore
function getMessages(roomId, callback) {
  return onSnapshot(
    query(
      collection(db, "chat-channels", roomId, "messages"),
      orderBy("timestamp", "asc")
    ),
    (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(messages);
    }
  );
}
// Get single message from firestroe
export {
  loginWithGoogle,
  sendMessage,
  getMessages,
  replyMessage,
  createUser,
  createMember,
  queryUser,
  updateUser,
  deleteMessage,
  storage,
};
