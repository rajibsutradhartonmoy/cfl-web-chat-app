import {
  Avatar,
  HStack,
  Text,
  VStack,
  Box,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  Image,
} from "@chakra-ui/react";
import React from "react";
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
  referenceMessage,
}) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <>
      {" "}
      <VStack
        width={"full"}
        alignItems={"flex-start"}
        onMouseEnter={onToggle}
        onMouseLeave={onClose}
        _hover={{ background: "#e3e5e8" }}
        cursor={"pointer"}
        padding={"10px"}
        position={"relative"}
        border={"1px solid #ADD8E6"}
        borderRadius={"md"}
      >
        {referenceMessage ? (
          <VStack
            width={"full"}
            alignItems={"flex-start"}
            spacing={1}
            padding={"2"}
            background={"blackAlpha.200"}
            borderRadius={"md"}
            borderLeft={"4px solid #ADD8E6"}
          >
            <Text fontSize={"xs"}>{referenceMessage?.displayName}</Text>
            <Text fontSize={"xs"}>{referenceMessage?.text}</Text>
          </VStack>
        ) : (
          ""
        )}
        <VStack width={"full"} alignItems={"flex-start"}>
          {messageFile ? (
            <Box>
              <Image src={messageFile} maxW={"200px"} borderRadius={"10px"} />
            </Box>
          ) : (
            ""
          )}
          <HStack width={"full"} alignItems={"center"} gap={"10px"}>
            <Avatar src="image_url" size={"md"} />
            <VStack alignItems={"flex-start"}>
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

            <Popover
              returnFocusOnClose={false}
              isOpen={isOpen}
              onClose={onClose}
              placement={"top"}
              closeOnBlur={false}
            >
              <PopoverTrigger>
                <Box size={"md"} position={"absolute"} right={0} top={5}></Box>
              </PopoverTrigger>
              <PopoverContent width={"50px"}>
                <PopoverArrow />
                <PopoverBody>
                  <BsFillReplyFill onClick={reply} />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </HStack>
        </VStack>
      </VStack>
    </>
  );
};

export default ChatCard;
