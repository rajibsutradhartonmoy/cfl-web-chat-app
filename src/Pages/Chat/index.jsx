import { Avatar, Box, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import React, { createContext, useEffect, useState } from "react";
import LeftSideBar from "../../Components/LeftSideBar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import RightSideBar from "../../Components/RightSideBar";
export const MobileChatContext = createContext();

function Chat() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState({});
  const [mobileOtherUser, setMobileOtherUser] = useState("");

  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoading(false);
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
    <MobileChatContext.Provider value={{ mobileOtherUser, setMobileOtherUser }}>
      {userLoading ? (
        <Spinner />
      ) : (
        <HStack width={"full"}>
          <LeftSideBar
            displayName={user.displayName}
            userId={user.uid}
            displayPicture={user.displayPicture}
          >
            <RightSideBar peerId={user.uid} display={"flex"} />
          </LeftSideBar>
          <Box height={"100vh"}></Box>
        </HStack>
      )}
    </MobileChatContext.Provider>
  );
}

export default Chat;
