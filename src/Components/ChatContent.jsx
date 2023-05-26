import {
  HStack,
  VStack,
  Text,
  Textarea,
  Box,
  Input,
  Image,
} from "@chakra-ui/react";
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
import { storage } from "../services/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateDoc } from "firebase/firestore";

function ChatContent() {
  const { user } = useAuth();
  const params = useParams();
  const channel = params.channelId;
  const messages = useMessages(channel);
  const [messageImage, setMessageImage] = useState();
  const [percent, setPercent] = useState(0);
  const [message, setMessage] = useState("");
  const [showRef, setShowRef] = useState(false);
  const [referenceMessage, setReferenceMessage] = useState(null);
  const [resferenceDisplay, setReferenceDisplay] = useState(null);
  const selectedFileRef = useRef(null);

  const lastMessageRef = useRef(null);

  const writeMessage = (e) => {
    setMessage(e.target.value);
  };
  const onSendMessage = async () => {
    if (message.trim() !== "" || messageImage) {
      const docRef = await sendMessage(
        channel,
        user,
        message,
        referenceMessage && referenceMessage
      );
      console.log(docRef);
      if (messageImage) {
        uploadFile(messageImage, docRef);
      }
    }

    setMessage("");
    setMessageImage(null);
    setReferenceMessage(null);
    setReferenceDisplay(null);
  };

  const onSelectFile = (e) => {
    setMessageImage(e.target.files[0]);
  };
  const uploadFile = async (messageImage, docRef) => {
    if (messageImage) {
      const storageRef = ref(storage, `/files/${messageImage.name}`);
      const uploadTask = uploadBytesResumable(storageRef, messageImage);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          ); // update progress
          setPercent(percent);
        },
        (err) => console.log(err),
        async () => {
          // download url

          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            updateDoc(docRef, {
              chatImage: url,
            });
          });
        }
      );
    }
  };
  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowRef(false);
    setReferenceMessage(null);
    setReferenceDisplay(null);
    setMessage("");
    setMessageImage(null);
    setPercent(0);
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
            const {
              text,
              id,
              displayName,
              timestamp,
              referenceMessage,
              chatImage,
            } = message;
            return (
              <ChatCard
                message={text}
                referenceMessage={referenceMessage ? referenceMessage : ""}
                messageFile={chatImage && chatImage}
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
        {messageImage ? (
          <Box padding={"10px"}>
            <Image
              width={"200px"}
              borderRadius={"10px"}
              src={URL.createObjectURL(messageImage)}
            />
            <Text fontSize={"xx-small"}>{percent}</Text>
          </Box>
        ) : (
          ""
        )}
        <HStack width={"full"} py={"10px"} pr={"10px"} pl={"20px"}>
          <ImAttachment
            fontSize={"20px"}
            style={{ cursor: "pointer" }}
            onClick={() => selectedFileRef.current?.click()}
          />

          <Input
            type="file"
            ref={selectedFileRef}
            onChange={onSelectFile}
            hidden
          />

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
