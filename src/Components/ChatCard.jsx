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
import React, { useState } from "react";
import { BsFillReplyFill } from "react-icons/bs";
import { AiOutlineEllipsis } from "react-icons/ai";

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
                    <BsFillReplyFill onClick={reply} cursor={"pointer"} />
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
          replies={replies ? replies : ""}
        />
      </VStack>
    </>
  );
};
const ThreadDrawer = (props) => {
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
            <ChatCard username={props.displayName} />
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
                      <ChatCard
                        username={reply.displayName}
                        message={reply.text}
                      />
                    );
                  })
                : ""}
            </VStack>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
export default ChatCard;
