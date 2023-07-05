import "./chatlink.css";
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
  Link,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { BsFillReplyFill } from "react-icons/bs";
import { AiFillDelete, AiOutlineEllipsis } from "react-icons/ai";
import { HiOutlineReply } from "react-icons/hi";
import { replyMessage, storage, deleteMessage } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";
import { useLocation, useParams } from "react-router-dom";
import MessageInput from "./MessageInput";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateDoc } from "firebase/firestore";
import { LinkItUrl } from "react-linkify-it";

const ChatCard = ({
  username,
  viewerId,
  uid,
  time,
  messageFile,
  fileType,
  displayPicture,
  message,
  reactions,
  replies,
  messageId,
  messageRef,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showAction, setShowAction] = useState(false);
  const params = useParams();
  const channel = params.channelId;

  return (
    <>
      {" "}
      <VStack
        width={"full"}
        alignItems={"flex-start"}
        onMouseEnter={() => setShowAction(true)}
        onMouseLeave={() => setShowAction(false)}
        px={"5px"}
        position={"relative"}
        borderRadius={"md"}
        ref={messageRef}
        // onClick={() => {
        //   alert(messageFile.split("?")[0].split("files")[1]);
        // }}
      >
        <Box
          width={"full"}
          height={"1px"}
          mb={"10px"}
          bg={
            "linear-gradient(270deg, rgba(88, 101, 242, 0.2) 0%, #5865F2 45.74%, rgba(88, 101, 242, 0.2) 100%)"
          }
        ></Box>
        <VStack width={"full"} alignItems={"flex-start"}>
          {messageFile ? (
            <Box>
              {/* {fileType === "gif" ||
              fileType === "jpg" ||
              fileType === "png" ||
              fileType === "jpeg" ||
              fileType === "webp" ||
              fileType === "svg" ||
              fileType === "svg+xml" ? (
                <Image src={messageFile} maxW={"200px"} borderRadius={"10px"} />
              ) : fileType === "pdf" ? (
                <VStack
                  height={"100px"}
                  padding={"10px"}
                  borderRadius={"10px"}
                  justifyContent={"center"}
                >
                  <Link href={messageFile} color={"blue.300"}>
                    <Image
                      src={"/assets/images/pdf.png"}
                      width={"50px"}
                      borderRadius={"10px"}
                    />
                  </Link>
                </VStack>
              ) : fileType === "mp4" ? (
                <video controls width="250" style={{ borderRadius: "10px" }}>
                  <source src={messageFile} type="video/mp4"></source>
                </video>
              ) : (
                ""
              )} */}
              <Image src={messageFile} maxW={"200px"} borderRadius={"10px"} />
            </Box>
          ) : (
            ""
          )}
          <HStack
            width={"full"}
            alignItems={"center"}
            spacing={2}
            color={"#4F5660"}
          >
            <Avatar src={displayPicture} size={"md"} />
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
              <LinkItUrl className="purple">
                <Text fontSize={"14px"}>{message}</Text>
              </LinkItUrl>

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
                {viewerId === uid ? (
                  <Tooltip label="Delete message" fontSize={"xs"}>
                    <span>
                      <AiFillDelete
                        color="red"
                        cursor={"pointer"}
                        onClick={() => {
                          if (viewerId === uid) {
                            deleteMessage(channel, messageId);
                          } else {
                            alert("you cannot delete another user's message");
                          }
                        }}
                      />
                    </span>
                  </Tooltip>
                ) : (
                  ""
                )}
              </HStack>
            )}
          </HStack>
        </VStack>
        {replies ? (
          replies.length > 0 ? (
            <HStack
              alignItems={"flex-end"}
              spacing={1}
              padding={"2"}
              color="#5865F2"
              cursor={"pointer"}
              onClick={() => onOpen()}
              ml={"40px !important"}
            >
              <HiOutlineReply fontSize={"24px"} color="#5865F2" />
              <Text fontSize={"xs"}>
                {replies.length} {replies.length > 1 ? "Replies" : "Reply"}
              </Text>
            </HStack>
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
          displayPicture={displayPicture}
        />
      </VStack>
    </>
  );
};
const ReplyChatCard = ({
  username,
  time,
  messageFile,
  displayPicture,
  message,
  reactions,
}) => {
  return (
    <VStack width={"full"} alignItems={"flex-start"} padding={"1"}>
      <Box
        width={"full"}
        height={"1px"}
        mb={"2px"}
        bg={
          "linear-gradient(270deg, rgba(88, 101, 242, 0.2) 0%, #5865F2 45.74%, rgba(88, 101, 242, 0.2) 100%)"
        }
      ></Box>
      {messageFile ? (
        <Box>
          <Image src={messageFile} maxW={"200px"} borderRadius={"10px"} />
        </Box>
      ) : (
        ""
      )}
      <HStack width={"full"} alignItems={"center"} spacing={2}>
        <Avatar src={displayPicture} size={"sm"} />
        <VStack alignItems={"flex-start"} spacing={0}>
          <HStack alignItems={"center"}>
            <Text color={"#4F5660"} fontWeight={"500"} fontSize={"xs"}>
              {username}
            </Text>
            <Text fontSize={"12px"}>
              {time
                ? time
                : `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`}
            </Text>
          </HStack>
          <LinkItUrl className="purple">
            <Text fontSize={"xs"}>{message}</Text>
          </LinkItUrl>
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
  const [lastMessage, setLastMessage] = useState(props.replies);
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  const writeMessage = (e) => {
    setMessage(e.target.value);
  };

  const onSelectFile = (e) => {
    setMessageFile(e.target.files[0]);
    setFileType(e.target.files[0].type.split("/")[0]);
  };

  const uploadFile = async (messageFile, replyRef) => {
    if (messageFile) {
      const storageRef = ref(storage, `/files/${messageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, messageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          ); // update progress
          // setPercent(percent);
        },
        (err) => console.log(err),
        async () => {
          // download url

          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            replyMessage(splitLocation[1], channel, props.messageId, [
              ...props.replies,
              {
                uid: user.uid,
                displayName: user.displayName,
                timestamp: new Date(),
                displayPicture: user.photoURL,
                messageFile: url,
              },
            ]);
          });
        }
      );
    }
  };
  const onSendMessage = async () => {
    if (message.trim() !== "" || messageFile) {
      replyMessage(splitLocation[1], channel, props.messageId, [
        ...props.replies,
        {
          uid: user.uid,
          displayName: user.displayName,
          text: message.trim(),
          timestamp: new Date(),
          displayPicture: user.photoURL,
        },
      ]);

      const replyID = props.replies.length;
      alert(replyID);
      //   const docRef = await sendMessage(channel, user, message);
      //   console.log(docRef);
      if (messageFile) {
        uploadFile(messageFile, replyID);
      }
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
              displayPicture={props.displayPicture}
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
                ? props.replies.map((reply, id) => {
                    return (
                      <ReplyChatCard
                        key={id}
                        username={reply.displayName}
                        messageFile={reply.messageFile}
                        message={reply.text}
                        time={reply.timestamp?.toDate().toLocaleString()}
                        displayPicture={reply.displayPicture}
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
              placeholder={"Reply to this thread"}
            />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
const ImageModal = (props) => {
  <Drawer
    isOpen={props.imageOpen}
    placement="right"
    onClose={props.imageClose}
    size={"md"}
  >
    <Image src={props.image} />
  </Drawer>;
};
export default ChatCard;
