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
  getDoc,
  updateDoc,
  setDoc,
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
  databaseURL: process.env.REACT_APP_DATABASE_URL,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

//login
async function loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    const { user } = await signInWithPopup(auth, provider);

    // await collection(db, "members").doc(user.uid).set({
    //   uid: user.uid,
    //   displayName: user.displayName,
    //   displayPicture: user.photoURL,
    //   email: user.email,
    //   provider: user.providerData[0].providerId,
    // });

    console.log(user);
    const member = {
      uid: user.uid,
      displayName: user.displayName,
      displayPicture: user.photoURL,
      email: user.email,
      provider: user.providerData[0].providerId,
      detailsUpdated: false,
    };
    await setDoc(doc(db, "members", user.uid), member);
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

//Logout user

const handleLogout = async () => {
  const logout = await getAuth().signOut();
  return logout;
};

//Write message document to firestore
async function sendMessage(path, channelId, user, text) {
  try {
    if (path === "channels") {
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
    } else if (path === "dms") {
      const docRef = await addDoc(
        collection(db, "dms", channelId, "messages"),
        {
          uid: user.uid,
          displayName: user.displayName,
          text: text.trim(),
          timestamp: serverTimestamp(),
          displayPicture: user.photoURL,
        }
      );
      return docRef;
    }
  } catch (error) {
    console.error(error);
  }
}
// Create member document in firestor
async function updateMember(memberID, data) {
  try {
    const memberDocRef = doc(db, "members", memberID);
    await updateDoc(memberDocRef, data);
    return true;
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

async function queryUser(id) {
  const userRef = doc(db, "members", id);
  try {
    const docsSnap = await getDoc(userRef);
    console.log(docsSnap.data());
    return docsSnap;
  } catch (error) {
    console.log(error);
  }
}

//Reply message
function replyMessage(path, channelId, messageId, replies) {
  const messageRef = doc(
    db,
    path === "channels" ? "chat-channels" : path,
    channelId,
    "messages",
    messageId
  );
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
function getMessages(path, roomId, callback) {
  return onSnapshot(
    query(
      collection(
        db,
        path === "channels" ? "chat-channels" : path,
        roomId,
        "messages"
      ),
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

async function fetchUsers() {
  const querySnapshot = await getDocs(collection(db, "members"));

  const members = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    displayName: doc.data().displayName,
    displayPicture: doc.data().displayPicture,
    company: doc.data()?.company_name,
    about: doc.data()?.company_description,
  }));
  console.table(members);

  return members;
}
// Get single message from firestroe
export {
  loginWithGoogle,
  handleLogout,
  sendMessage,
  getMessages,
  replyMessage,
  createUser,
  updateMember,
  queryUser,
  updateUser,
  deleteMessage,
  fetchUsers,
  storage,
  app,
};
