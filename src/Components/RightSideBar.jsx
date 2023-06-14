import React from "react";
import { VStack, HStack, Text } from "@chakra-ui/react";

const RightSideBar = () => {
  return (
    <VStack
      flex={1.5}
      background={"#f2f3f5"}
      height={"100vh"}
      overflowY={"scroll"}
      padding={"10px"}
      display={["none", "none", "flex"]}
    >
      <HStack position={"sticky"} gap={"60px"} alignItems={"center"}>
        <Text fontSize={"md"} fontWeight={"500"}>
          Members
        </Text>
      </HStack>
      <VStack>
        <HStack>
          <Text fontSize={"14px"}>Admins</Text>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default RightSideBar;
