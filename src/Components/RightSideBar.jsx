import React, { useEffect, useState } from "react";
import { VStack, HStack, Text, Spinner, Input, Box } from "@chakra-ui/react";
import { fetchUsers } from "../services/firebase";
import MemberCard from "./MemberCard";
const RightSideBar = (props) => {
  const [members, setMembers] = useState([]);
  const [filteredUser, setFilteredUser] = useState([]);
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
      padding={"40px 10px"}
      display={["none", "none", "flex"]}
    >
      <HStack position={"sticky"} gap={"60px"} alignItems={"center"}>
        <Text fontSize={"md"} fontWeight={"500"}>
          Members
        </Text>
      </HStack>
      <Input
        placeholder="Search member"
        onChange={(e) => {
          if (e.target.value !== "") {
            const searchResult = members.filter((member) => {
              return member.displayName.toLowerCase().includes(e.target.value);
            });
            setFilteredUser(searchResult);
          } else {
            setFilteredUser([]);
          }
        }}
      />
      <VStack width={"full"} gap={"10px"}>
        <VStack width={"full"} paddingBottom={"20px"}>
          {filteredUser.length > 0
            ? filteredUser.map((member, id) => {
                return (
                  <MemberCard
                    displayPicture={member.displayPicture}
                    displayName={member.displayName}
                    company={member.company}
                    about={member.about}
                    key={id}
                    uid={member.id}
                    peerId={props.peerId}
                  />
                );
              })
            : ""}

          <Box
            sx={{
              width: "full",
              height: "1px",
              background:
                "linear-gradient(270deg, rgba(88, 101, 242, 0.2) 0%, #5865F2 45.74%, rgba(88, 101, 242, 0.2) 100%)",
            }}
          ></Box>
        </VStack>
        {members.length > 0
          ? members.map((member, id) => {
              return (
                <MemberCard
                  displayPicture={member.displayPicture}
                  company={member.company}
                  about={member.about}
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
