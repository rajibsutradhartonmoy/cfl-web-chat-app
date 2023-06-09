import React from "react";
import { loginWithGoogle } from "../services/firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";

const AuthContext = React.createContext();

const AuthProvider = (props) => {
  const [user, setUser] = React.useState(null);
  const auth = getAuth();
  async function checkAuthState(auth) {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          setUser(user);
          resolve(user);
        } else {
          // User is signed out
          reject("User is signed out");
        }
      });
    });
  }
  async function someAsyncFunction() {
    try {
      const user = await checkAuthState(auth);
      setUser(user);
      // Handle signed-in user
      // ...
    } catch (error) {
      console.log("no user");
      // Handle signed-out user or error
      // ...
    }
  }
  someAsyncFunction();

  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     // User is signed in, see docs for a list of available properties
  //     // https://firebase.google.com/docs/reference/js/auth.user
  //     setUser(user);
  //     // ...
  //   } else {
  //     // User is signed out
  //     // ...
  //   }
  // });
  const login = async () => {
    const user = await loginWithGoogle();

    if (!user) {
      // TODO: Handle failed login
    }

    setUser(user);
  };

  const value = { user, login };

  return <AuthContext.Provider value={value} {...props} />;
};

export { AuthContext, AuthProvider };
