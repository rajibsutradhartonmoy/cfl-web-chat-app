import { Avatar, Box, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";
import LeftSideBar from "./LeftSideBar";
import ChatContent from "./ChatContent";
import RightSideBar from "./RightSideBar";
import { useAuth } from "../hooks/useAuth";
import { useParams } from "react-router-dom";

function Container() {
  const params = useParams();
  const { user } = useAuth();
  const channelId = params.channelId;

  return (
    <HStack width={"full"}>
      <Box display={["none", "none", "block"]}>
        <LeftSideBar
          displayName={user.displayName}
          userId={user.uid}
          displayPicture={user.photoURL}
        />
      </Box>

      <ChatContent channelId={channelId} />
      <RightSideBar peerId={user.uid} />
    </HStack>
  );
}

export default Container;
