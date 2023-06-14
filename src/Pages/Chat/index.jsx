import { Avatar, Box, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import LeftSideBar from "../../Components/LeftSideBar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
function Chat() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState({});
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoading(false);
        console.log(user);
        setUser(user);
      } else {
        navigate("/login");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {userLoading ? (
        <Spinner />
      ) : (
        <HStack width={"full"}>
          <LeftSideBar
            displayName={user.displayName}
            userId={user.uid}
            displayPicture={user.displayPicture}
          />
          <Box height={"100vh"}></Box>
        </HStack>
      )}
    </>
  );
}

export default Chat;