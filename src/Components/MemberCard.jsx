import { Avatar, HStack, Text, VStack } from "@chakra-ui/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const MemberCard = (props) => {
  const combinedId =
    props.peerId > props.uid
      ? props.peerId + props.uid
      : props.uid + props.peerId;
  return (
    <Popover>
      <HStack
        width={"full"}
        alignItems={"center"}
        gap={"10px"}
        _hover={{ color: "#5858df" }}
      >
        <PopoverTrigger>
          <Avatar cursor={"pointer"} size={"sm"} src={props.displayPicture} />
        </PopoverTrigger>
        <Link to={`/dms/${combinedId}`}>
          <Text fontSize={"sm"}>{props.displayName}</Text>
        </Link>
      </HStack>

      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>About {props.displayName}</PopoverHeader>
        <PopoverBody>
          <VStack width={"full"} alignItems={"flex-start"} gap={"20px"}>
            <VStack width={"full"} alignItems={"flex-start"}>
              <Text>Company</Text>
              <Text fontSize={"sm"} color={"#4F5660"}>
                {props.company}
              </Text>
            </VStack>

            <VStack width={"full"} alignItems={"flex-start"}>
              <Text>About</Text>
              <Text fontSize={"sm"} color={"#4F5660"}>
                {props.about}
              </Text>
            </VStack>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default MemberCard;

// const MemberPortal = () => {
//   return (
//     <Popover>
//       <HStack
//         width={"full"}
//         alignItems={"center"}
//         gap={"10px"}
//         _hover={{ color: "#5858df" }}
//       >
//         <PopoverTrigger>
//           <Avatar size={"sm"} src={props.displayPicture} />
//         </PopoverTrigger>
//         <Link to={`/dms/${combinedId}`}>
//           <Text fontSize={"sm"}>{props.displayName}</Text>
//         </Link>
//       </HStack>

//       <PopoverContent>
//         <PopoverArrow />
//         <PopoverCloseButton />
//         <PopoverHeader>Confirmation!</PopoverHeader>
//         <PopoverBody>Are you sure you want to have that milkshake?</PopoverBody>
//       </PopoverContent>
//     </Popover>
//   );
// };
