import React, { useEffect, useState } from "react";
import { VStack, HStack, Text, Spinner } from "@chakra-ui/react";
import { fetchUsers } from "../services/firebase";
import MemberCard from "./MemberCard";
const RightSideBar = (props) => {
  const [members, setMembers] = useState([]);
  useEffect(() => {
    const fetchMembers = async () => {
      const members = await fetchUsers();
      setMembers(members);
    };
    fetchMembers();
  }, []);
  return (
    <VStack
      flex={1.5}
      background={"#f2f3f5"}
      height={"100vh"}
      overflowY={"scroll"}
      padding={"10px"}
      display={["none", "none", "flex"]}
    >
      <HStack position={"sticky"} gap={"60px"} alignItems={"center"}>
        <Text fontSize={"md"} fontWeight={"500"}>
          Members
        </Text>
      </HStack>
      <VStack width={"full"} gap={"10px"}>
        {members.length > 0
          ? members.map((member, id) => {
              return (
                <MemberCard
                  displayPicture={member.displayPicture}
                  displayName={member.displayName}
                  key={id}
                  uid={member.id}
                  peerId={props.peerId}
                />
              );
            })
          : ""}
      </VStack>
    </VStack>
  );
};

export default RightSideBar;
