import { Avatar, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";
import LeftSideBar from "./LeftSideBar";
import ChatContent from "./ChatContent";
import RightSideBar from "./RightSideBar";

function Container() {
  return (
    <HStack width={"full"}>
      <LeftSideBar />
      <ChatContent />
      <RightSideBar />
    </HStack>
  );
}

export default Container;
