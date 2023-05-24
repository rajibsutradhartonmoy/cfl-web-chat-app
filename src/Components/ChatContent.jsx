import { HStack, VStack, Text, Textarea, Box } from "@chakra-ui/react";
import { sendMessage } from "../services/firebase";
import React, { useState, useEffect, useRef } from "react";
import { AiFillPlusCircle, AiOutlineSend } from "react-icons/ai";
import { ImAttachment } from "react-icons/im";
import ChatCard from "./ChatCard";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useMessages } from "../hooks/useMessages";

function ChatContent() {
  const { user } = useAuth();
  const params = useParams();
  const channel = params.channelId;
  const messages = useMessages(channel);
  const [message, setMessage] = useState("");
  const lastMessageRef = useRef(null);

  const writeMessage = (e) => {
    setMessage(e.target.value);
  };
  const onSendMessage = () => {
    if (message.trim() !== "") {
      sendMessage(channel, user, message);
    }

    setMessage("");
  };
  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <VStack
      height={"100vh"}
      alignItems={"flex-start"}
      justifyContent={"space-between"}
      width={"full"}
      py={"20px"}
      flex={6}
    >
      <VStack
        width={"full"}
        alignItems={"flex-start"}
        height={"800vh"}
        overflowY={"scroll"}
      >
        <Text textAlign={"center"} width={"full"}>
          Welcome to the {channel} channel.
        </Text>
        {messages.length > 0 ? (
          messages.map(({ text, id, displayName, timestamp }) => {
            return (
              <ChatCard
                message={text}
                key={id}
                username={displayName}
                time={timestamp?.toDate().toLocaleString()}
              />
            );
          })
        ) : (
          <Text textAlign={"center"} width={"full"}>
            No message in the {channel} channel. Be the first to drop a message!
          </Text>
        )}
        <Box ref={lastMessageRef}></Box>
      </VStack>
      <HStack
        background={"#e3e5e8"}
        width={"full"}
        py={"10px"}
        pr={"10px"}
        pl={"20px"}
        borderRadius={"10px"}
      >
        <ImAttachment fontSize={"20px"} />

        <Textarea
          placeholder="Send message to this channel"
          minH={"30px"}
          resize={"none"}
          border={"none"}
          outline={"none"}
          _focusVisible={{ outline: "none" }}
          value={message}
          onChange={writeMessage}
        />

        <HStack
          cursor={"pointer"}
          padding={"10px"}
          background={"#000"}
          borderRadius={"full"}
          onClick={() => onSendMessage()}
        >
          <AiOutlineSend color="#fff" />
        </HStack>
      </HStack>
    </VStack>
  );
}

export default ChatContent;
