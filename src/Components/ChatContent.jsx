import { HStack, VStack, Text, Textarea, Box } from "@chakra-ui/react";
import { sendMessage } from "../services/firebase";
import React, { useState, useEffect, useRef } from "react";
import {
  AiFillCloseCircle,
  AiFillPlusCircle,
  AiOutlineSend,
} from "react-icons/ai";
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
  const [showRef, setShowRef] = useState(false);
  const [referenceMessage, setReferenceMessage] = useState(null);
  const [resferenceDisplay, setReferenceDisplay] = useState(null);
  const lastMessageRef = useRef(null);

  const writeMessage = (e) => {
    setMessage(e.target.value);
  };
  const onSendMessage = () => {
    if (message.trim() !== "") {
      sendMessage(channel, user, message, referenceMessage && referenceMessage);
    }

    setMessage("");
    setReferenceMessage(null);
    setReferenceDisplay(null);
  };
  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowRef(false);
    setReferenceMessage(null);
    setReferenceDisplay(null);
    setMessage("");
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
        gap={"20px"}
      >
        <Text textAlign={"center"} width={"full"}>
          Welcome to the {channel} channel.
        </Text>
        {messages.length > 0 ? (
          messages.map((message) => {
            const { text, id, displayName, timestamp, referenceMessage } =
              message;
            return (
              <ChatCard
                message={text}
                referenceMessage={referenceMessage ? referenceMessage : ""}
                key={id}
                username={displayName}
                time={timestamp?.toDate().toLocaleString()}
                reply={() => {
                  setShowRef(true);
                  setReferenceMessage(message);
                  setReferenceDisplay(
                    <React.Fragment>
                      <Box width={"full"} padding={"5px"}>
                        <Text fontSize={"xs"} color={"blue.400"} width={"full"}>
                          {" "}
                          Replying to {displayName}
                        </Text>
                      </Box>
                    </React.Fragment>
                  );
                }}
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
      <VStack
        background={"#e3e5e8"}
        borderRadius={"10px"}
        alignItems={"flex-start"}
        width={"full"}
      >
        {showRef ? (
          <HStack
            position={"relative"}
            width={"full"}
            height={"40px"}
            bg={"gray.100"}
          >
            {resferenceDisplay}
            <Box
              position={"absolute"}
              top={1}
              right={1}
              onClick={() => {
                setReferenceMessage("");
                setShowRef(false);
              }}
              cursor={"pointer"}
            >
              <AiFillCloseCircle fontSize={"20px"} />
            </Box>
          </HStack>
        ) : (
          ""
        )}
        <HStack width={"full"} py={"10px"} pr={"10px"} pl={"20px"}>
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
    </VStack>
  );
}

export default ChatContent;
