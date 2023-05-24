import { Avatar, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";

const ChatCard = ({ username, time, image_url, message, reactions }) => {
  return (
    <HStack
      _hover={{ background: "#e3e5e8" }}
      width={"full"}
      alignItems={"center"}
      padding={"10px"}
      gap={"10px"}
      cursor={"pointer"}
    >
      <Avatar src="image_url" size={"md"} />
      <VStack alignItems={"flex-start"}>
        <HStack alignItems={"center"}>
          <Text fontWeight={"500"}>{username}</Text>
          <Text fontSize={"xs"}>
            {time
              ? time
              : `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`}
          </Text>
        </HStack>
        <Text fontSize={"14px"}>{message}</Text>
        {reactions && (
          <HStack>
            {reactions.length > 0
              ? reactions.map((reaction) => {
                  return (
                    <HStack
                      fontWeight={"500"}
                      borderRadius={"10px"}
                      background={"#e3e5e8"}
                    >
                      <Text fontSize={"xs"}>{reaction.icon}</Text>
                      <Text fontSize={"xs"}>{reaction.count}</Text>
                    </HStack>
                  );
                })
              : ""}
          </HStack>
        )}
      </VStack>
    </HStack>
  );
};

export default ChatCard;
