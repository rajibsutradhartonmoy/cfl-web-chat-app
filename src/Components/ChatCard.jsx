import {
  Avatar,
  HStack,
  Text,
  VStack,
  Box,
  useDisclosure,
  Tooltip,
  Image,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { BsFillReplyFill } from "react-icons/bs";
import { AiOutlineEllipsis } from "react-icons/ai";
import { replyMessage, storage } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";
import { useParams } from "react-router-dom";
import MessageInput from "./MessageInput";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ChatCard = ({
  username,
  time,
  messageFile,
  image_url,
  message,
  reactions,
  reply,
  replies,
  refAction,
  messageId,
  messageRef,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showAction, setShowAction] = useState(false);
  return (
    <>
      {" "}
      <VStack
        width={"full"}
        alignItems={"flex-start"}
        onMouseEnter={() => setShowAction(true)}
        onMouseLeave={() => setShowAction(false)}
        _hover={{ background: "#e3e5e8" }}
        padding={"5px"}
        position={"relative"}
        border={"1px solid #ADD8E6"}
        borderRadius={"md"}
        ref={messageRef}
      >
        <VStack width={"full"} alignItems={"flex-start"}>
          {messageFile ? (
            <Box>
              <Image src={messageFile} maxW={"200px"} borderRadius={"10px"} />
            </Box>
          ) : (
            ""
          )}
          <HStack width={"full"} alignItems={"center"} spacing={2}>
            <Avatar src="image_url" size={"md"} />
            <VStack alignItems={"flex-start"} spacing={1}>
              <HStack alignItems={"center"}>
                <Text fontWeight={"500"} fontSize={"sm"}>
                  {username}
                </Text>
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
            {showAction && (
              <HStack
                padding={2}
                width={"50px"}
                position={"absolute"}
                right={0}
                border={"1px solid gray"}
                bg={"#fff"}
                justifyContent={"center"}
                borderRadius={"md"}
                top={-5}
              >
                <Tooltip label="Reply in thread" fontSize={"xs"}>
                  <span>
                    <BsFillReplyFill
                      onClick={() => onOpen()}
                      cursor={"pointer"}
                    />
                  </span>
                </Tooltip>
              </HStack>
            )}
          </HStack>
        </VStack>
        {replies ? (
          replies.length > 0 ? (
            <VStack
              width={"full"}
              alignItems={"flex-start"}
              spacing={1}
              padding={"2"}
              background={"blackAlpha.200"}
              borderRadius={"md"}
              borderLeft={"4px solid #ADD8E6"}
              cursor={"pointer"}
              onClick={() => onOpen()}
            >
              <Text fontSize={"xs"}>{replies.length} replies</Text>
            </VStack>
          ) : (
            ""
          )
        ) : (
          ""
        )}
        <ThreadDrawer
          isOpen={isOpen}
          onClose={onClose}
          displayName={username}
          message={message}
          replies={replies ? replies : ""}
          messageId={messageId}
        />
      </VStack>
    </>
  );
};
const ReplyChatCard = ({
  username,
  time,
  messageFile,
  image_url,
  message,
  reactions,
}) => {
  return (
    <VStack
      width={"full"}
      alignItems={"flex-start"}
      border={"1px solid #ADD8E6"}
      borderRadius={"md"}
      padding={"1"}
    >
      {messageFile ? (
        <Box>
          <Image src={messageFile} maxW={"200px"} borderRadius={"10px"} />
        </Box>
      ) : (
        ""
      )}
      <HStack width={"full"} alignItems={"center"} spacing={2}>
        <Avatar src="image_url" size={"sm"} />
        <VStack alignItems={"flex-start"} spacing={0}>
          <HStack alignItems={"center"}>
            <Text fontWeight={"500"} fontSize={"xs"}>
              {username}
            </Text>
            <Text fontSize={"12px"}>
              {time
                ? time
                : `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`}
            </Text>
          </HStack>
          <Text fontSize={"xs"}>{message}</Text>
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
        {/* {showAction && (
          <HStack
            padding={2}
            width={"50px"}
            position={"absolute"}
            right={0}
            border={"1px solid gray"}
            bg={"#fff"}
            justifyContent={"center"}
            borderRadius={"md"}
            top={-5}
          >
            <Tooltip label="Reply in thread" fontSize={"xs"}>
              
            </Tooltip>
          </HStack>
        )} */}
      </HStack>
    </VStack>
  );
};
const ThreadDrawer = (props) => {
  const { user } = useAuth();
  const params = useParams();
  const channel = params.channelId;
  const lastMessageRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messageFile, setMessageFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [replies, setReplies] = useState(props.replies);
  const writeMessage = (e) => {
    setMessage(e.target.value);
  };

  const onSelectFile = (e) => {
    setMessageFile(e.target.files[0]);
    console.log(e.target.files[0].type.split("/")[0]);
    setFileType(e.target.files[0].type.split("/")[0]);
  };

  // const uploadFile = async (messageFile, docRef) => {
  //   if (messageFile) {
  //     const storageRef = ref(storage, `/files/${messageFile.name}`);
  //     const uploadTask = uploadBytesResumable(storageRef, messageFile);
  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const percent = Math.round(
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //         ); // update progress
  //         setPercent(percent);
  //       },
  //       (err) => console.log(err),
  //       async () => {
  //         // download url

  //         getDownloadURL(uploadTask.snapshot.ref).then((url) => {
  //           updateDoc(docRef, {
  //             chatImage: url,
  //           });
  //         });
  //       }
  //     );
  //   }
  // };
  const onSendMessage = async () => {
    if (message.trim() !== "" || messageFile) {
      const collectionRef = await replyMessage(channel, props.messageId, [
        ...props.replies,
        {
          uid: user.uid,
          displayName: user.displayName,
          text: message.trim(),
          timestamp: new Date(),
        },
      ]);

      console.log(collectionRef);

      //   const docRef = await sendMessage(channel, user, message);
      //   console.log(docRef);
      // if (messageFile) {
      //   uploadFile(messageFile, docRef);
      // }
      // }
      setMessage("");
      setMessageFile(null);

      // setMessageReplies([]);
    }
  };

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [props.replies]);

  return (
    <Drawer
      isOpen={props.isOpen}
      placement="right"
      onClose={props.onClose}
      size={"md"}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Thread</DrawerHeader>
        <DrawerBody>
          <VStack width={"full"} gap={"4"}>
            <ReplyChatCard
              username={props.displayName}
              message={props.message}
            />
            <HStack width={"full"}>
              <Text fontSize={"sm"}>
                {props.replies.length}{" "}
                {props.replies.length > 1 ? "Replies" : "Reply"}
              </Text>
              <hr style={{ width: "80%" }} />
            </HStack>
            <VStack width={"full"}>
              {props.replies.length > 0
                ? props.replies.map((reply) => {
                    return (
                      <ReplyChatCard
                        username={reply.displayName}
                        message={reply.text}
                        time={reply.timestamp?.toDate().toLocaleString()}
                      />
                    );
                  })
                : ""}
            </VStack>
            <Box ref={lastMessageRef}></Box>
            <MessageInput
              message={message}
              messageFile={messageFile}
              fileType={fileType}
              removeFile={() => setMessageFile(null)}
              writeMessage={writeMessage}
              onSelectFile={onSelectFile}
              sendMessage={onSendMessage}
            />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
export default ChatCard;
