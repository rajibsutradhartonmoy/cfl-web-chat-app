import { Avatar, Box, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";
import LeftSideBar from "./LeftSideBar";
import ChatContent from "./ChatContent";
import RightSideBar from "./RightSideBar";
import { useAuth } from "../hooks/useAuth";

function Container() {
  const { user } = useAuth();
  return (
    <HStack width={"full"}>
      <Box display={["none", "none", "block"]}>
        <LeftSideBar
          displayName={user.displayName}
          userId={user.uid}
          displayPicture={user.displayPicture}
        />
      </Box>

      <ChatContent />
      <RightSideBar />
    </HStack>
  );
}

export default Container;
