import React from "react";
import { loginWithGoogle } from "../services/firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";

const AuthContext = React.createContext();

const AuthProvider = (props) => {
  const [user, setUser] = React.useState(null);
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      setUser(user);
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
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
