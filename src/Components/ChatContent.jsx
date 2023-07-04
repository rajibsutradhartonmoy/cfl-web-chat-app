import {
  HStack,
  VStack,
  Text,
  Textarea,
  Box,
  Input,
  Image,
} from "@chakra-ui/react";
import { Document, Page } from "react-pdf";
import { sendMessage } from "../services/firebase";
import React, { useState, useEffect, useRef } from "react";
import {
  AiFillCloseCircle,
  AiFillPlusCircle,
  AiOutlineSend,
} from "react-icons/ai";
import { ImAttachment } from "react-icons/im";
import ChatCard from "./ChatCard";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useMessages } from "../hooks/useMessages";
import { storage, replyMessage } from "../services/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";
import { serverTimestamp, updateDoc } from "firebase/firestore";
import { BsArrowLeft, BsBack } from "react-icons/bs";

function ChatContent(props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  const channel = props.channelId;
  const messages = useMessages(splitLocation[1], channel);
  const [pageId, setPageId] = useState(splitLocation[2]);
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
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

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
        const docRef = await sendMessage(
          splitLocation[1],
          channel,
          user,
          message
        );
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
    setFileType(e.target.files[0].type.split("/")[1]);
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

    setmessageFile(null);
    setPercent(0);
    setMessageReply([]);
  }, [messages]);

  useEffect(() => {
    setMessage("");
  }, [pageId]);
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
      <HStack
        position={"sticky"}
        display={["flex", "flex", "none"]}
        bg={"#fff"}
        zIndex={"99"}
        top={0}
        width={"full"}
        pl={"20px"}
        alignItems={"center"}
        gap={"100px"}
        boxShadow={"rgba(169, 170, 176, 0.47) 1px 3px 5px -1px"}
        pb={"10px"}
      >
        <BsArrowLeft fontSize={"30px"} onClick={() => navigate("/channels")} />
        <Text textTransform={"capitalize"} fontWeight={"500"} color={"#4F5660"}>
          {channel}
        </Text>
      </HStack>
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
          {splitLocation[1] === "channels"
            ? `Welcome to the ${channel} channel`
            : ""}
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
              uid,
            } = messageItem;
            if (chatImage) {
              messageItem.type = chatImage
                .split("?")[0]
                .split("files")[1]
                .split(".")[1];
            }
            return (
              <ChatCard
                message={text}
                referenceMessage={referenceMessage ? referenceMessage : ""}
                messageFile={chatImage && chatImage}
                fileType={messageItem.type ? messageItem.type : ""}
                key={id}
                messageId={id}
                viewerId={user.uid}
                uid={uid}
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
            {splitLocation[1] === "channels"
              ? `No message in the ${channel} channel. Be the first to drop a message!`
              : "Start the conversation"}
          </Text>
        )}
        <Box ref={lastMessageRef}></Box>
      </VStack>
      <VStack
        background={"#f2f2f2"}
        borderRadius={"10px"}
        alignItems={"flex-start"}
        width={"full"}
      >
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
            {fileType === "gif" ||
            fileType === "jpg" ||
            fileType === "png" ||
            fileType === "jpeg" ||
            fileType === "webp" ||
            fileType === "svg+xml" ? (
              <Image
                width={"200px"}
                borderRadius={"10px"}
                src={URL.createObjectURL(messageFile)}
              />
            ) : (
              <Box>
                <Text color={"blue.300"}>{messageFile.name}</Text>
              </Box>
            )}
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
            accept={"image/*,video/mp4,video/x-m4v,video/*,.pdf"}
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
            background={"#1180fe"}
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
