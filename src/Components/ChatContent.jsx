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
import { storage, replyMessage } from "../services/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { serverTimestamp, updateDoc } from "firebase/firestore";

function ChatContent() {
  const { user } = useAuth();
  console.log(user);
  const params = useParams();
  const channel = params.channelId;
  const messages = useMessages(channel);
  const [messageFile, setmessageFile] = useState();
  const [percent, setPercent] = useState(0);
  const [message, setMessage] = useState("");
  const [showRef, setShowRef] = useState(false);
  const [messageReplies, setMessageReplies] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [messageReply, setMessageReply] = useState(null);
  const [messageId, setMessageId] = useState(null);
  const [referenceMessage, setReferenceMessage] = useState(null);
  const [resferenceDisplay, setReferenceDisplay] = useState(null);
  const [fileType, setFileType] = useState(null);
  const selectedFileRef = useRef(null);
  const lastMessageRef = useRef(null);

  const writeMessage = (e) => {
    setMessage(e.target.value);
  };
  const onSendMessage = async () => {
    if (message.trim() !== "" || messageFile) {
      if (showRef) {
        // alert(messageReplies.length);
        replyMessage(channel, messageId, [
          ...messageReplies,
          {
            uid: user.uid,
            displayName: user.displayName,
            text: message.trim(),
            timestamp: new Date(),
            photoURL: user.photoURL,
          },
        ]);
      } else {
        const docRef = await sendMessage(channel, user, message);
        console.log(docRef);
        if (messageFile) {
          uploadFile(messageFile, docRef);
        }
      }
    }
    setShowRef(false);
    setMessage("");
    setmessageFile(null);
    setReferenceMessage(null);
    setReferenceDisplay(null);
    // setMessageReplies([]);
  };

  const onSelectFile = (e) => {
    setmessageFile(e.target.files[0]);
    console.log(e.target.files[0].type.split("/")[0]);
    setFileType(e.target.files[0].type.split("/")[0]);
  };
  const uploadFile = async (messageFile, docRef) => {
    if (messageFile) {
      const storageRef = ref(storage, `/files/${messageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, messageFile);
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
    setmessageFile(null);
    setPercent(0);
    setMessageReply([]);
  }, [messages]);

  return (
    <VStack
      height={"100vh"}
      alignItems={"flex-start"}
      justifyContent={"space-between"}
      width={"full"}
      py={"20px"}
      flex={6}
      position={"relative"}
    >
      <VStack
        width={"full"}
        alignItems={"flex-start"}
        height={"800vh"}
        overflowY={"scroll"}
        gap={"10px"}
      >
        <Text
          textAlign={"center"}
          fontWeight={"bold"}
          width={"full"}
          fontSize={"xl"}
          color={"#4F5660"}
        >
          Welcome to the {channel} channel.
        </Text>
        {messages.length > 0 ? (
          messages.map((messageItem) => {
            const {
              text,
              id,
              displayName,
              timestamp,
              referenceMessage,
              chatImage,
              replies,
              displayPicture,
            } = messageItem;

            return (
              <ChatCard
                message={text}
                referenceMessage={referenceMessage ? referenceMessage : ""}
                messageFile={chatImage && chatImage}
                key={id}
                messageId={id}
                replies={replies}
                username={displayName}
                time={timestamp?.toDate().toLocaleString()}
                displayPicture={displayPicture ? displayPicture : ""}
                reply={() => {
                  if (replies) {
                    setMessageReplies(replies);
                  }
                  setShowRef(true);
                  setMessageId(id);
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
          </HStack>
        ) : (
          ""
        )}
        {messageFile ? (
          <Box padding={"10px"} position={"relative"} width={"full"}>
            <Box
              position={"absolute"}
              top={1}
              right={1}
              onClick={() => {
                setmessageFile(null);
              }}
              cursor={"pointer"}
            >
              <AiFillCloseCircle fontSize={"20px"} />
            </Box>
            {fileType === "image" && (
              <Image
                width={"200px"}
                borderRadius={"10px"}
                src={URL.createObjectURL(messageFile)}
              />
            )}

            <Text fontSize={"xx-small"}>{percent}</Text>
          </Box>
        ) : (
          ""
        )}
        <HStack width={"full"} py={"10px"} pr={"10px"} pl={"20px"}>
          <ImAttachment
            fontSize={"20px"}
            style={{ cursor: "pointer" }}
            color="#4F5660"
            onClick={() => selectedFileRef.current?.click()}
          />

          <Input
            type="file"
            ref={selectedFileRef}
            onChange={onSelectFile}
            hidden
            accept={"image/*,videos/*,.pdf"}
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSendMessage();
              }
            }}
          />

          <HStack
            cursor={"pointer"}
            padding={"10px"}
            background={"#4F5660"}
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
