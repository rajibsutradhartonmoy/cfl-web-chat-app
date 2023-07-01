import { Avatar, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const MemberCard = (props) => {
  const combinedId =
    props.peerId > props.uid
      ? props.peerId + props.uid
      : props.uid + props.peerId;
  return (
    <Link to={`/dms/${combinedId}`} style={{ width: "100%" }}>
      <HStack width={"full"} alignItems={"center"} gap={"10px"}>
        <Avatar size={"sm"} src={props.displayPicture} />
        <Text fontSize={"sm"}>{props.displayName}</Text>
      </HStack>
    </Link>
  );
};

export default MemberCard;
