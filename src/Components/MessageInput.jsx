import React, { useRef, useState } from "react";
import {
  HStack,
  Input,
  Textarea,
  Text,
  VStack,
  Box,
  Image,
} from "@chakra-ui/react";
import { ImAttachment } from "react-icons/im";
import { AiOutlineSend, AiFillCloseCircle } from "react-icons/ai";
const MessageInput = (props) => {
  const selectedFileRef = useRef(null);

  return (
    <VStack
      background={"#e3e5e8"}
      borderRadius={"10px"}
      alignItems={"flex-start"}
      width={"full"}
    >
      {props.messageFile ? (
        <Box padding={"10px"} width={"full"} position={"relative"}>
          <Box
            position={"absolute"}
            top={1}
            right={1}
            onClick={props.removeFile}
            cursor={"pointer"}
          >
            <AiFillCloseCircle fontSize={"20px"} />
          </Box>
          {props.fileType === "image" && (
            <Image
              width={"200px"}
              borderRadius={"10px"}
              src={URL.createObjectURL(props.messageFile)}
            />
          )}

          <Text fontSize={"xx-small"}>{props.percent}</Text>
        </Box>
      ) : (
        ""
      )}
      <HStack
        background={"#e3e5e8"}
        borderRadius={"10px"}
        width={"full"}
        py={"10px"}
        pr={"10px"}
        pl={"20px"}
      >
        <ImAttachment
          fontSize={"20px"}
          style={{ cursor: "pointer" }}
          onClick={() => selectedFileRef.current?.click()}
        />

        <Input
          type="file"
          ref={selectedFileRef}
          onChange={props.onSelectFile}
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
          value={props.message}
          onChange={props.writeMessage}
        />

        <HStack
          cursor={"pointer"}
          padding={"10px"}
          background={"#000"}
          borderRadius={"full"}
          onClick={props.sendMessage}
        >
          <AiOutlineSend color="#fff" />
        </HStack>
      </HStack>
    </VStack>
  );
};

export default MessageInput;
