import React from "react";
import { Avatar, HStack, Img, Text, VStack } from "@chakra-ui/react";
import { AiOutlineDown } from "react-icons/ai";
import ChatAvatar from "./ChatAvatar";
import { Link, useParams } from "react-router-dom";
const sideBarImage = [
  "https://i.postimg.cc/ZK7ngyd5/img1.png",
  "https://i.postimg.cc/Gm623wz0/img2.png",
  "https://i.postimg.cc/qRTvns9j/img3.png",
  "https://i.postimg.cc/W4r4hWfd/img4.png",
];
const channels = [
  { id: "general", title: "💬 General 💬" },
  { id: "tech", title: "💻 Science & Tech 💻" },
  { id: "idea", title: "💡 Ideas 💡" },
  { id: "news", title: "🗞 News 🗞" },
  { id: "mentorship", title: "🥸 Mentorship 🥸" },
  { id: "community", title: "🧑‍🤝‍🧑 Community 🧑‍🤝‍🧑" },
];
const LeftSideBar = () => {
  const params = useParams();
  const channel = params.channelId;
  return (
    <HStack height={"100vh"} spacing={0} flex={2}>
      <VStack bg={"#e3e5e8"} gap={"50px"} height={"100vh"} p={"10px"}>
        <ChatAvatar />
        <VStack justifyContent={"space-between"} gap={"10px"}>
          {sideBarImage.map((image) => {
            return <ChatAvatar image_url={image} showActive={true} />;
          })}
        </VStack>
      </VStack>
      <VStack
        background={"#f2f3f5"}
        height={"100vh"}
        overflowY={"scroll"}
        padding={"10px"}
      >
        <HStack position={"sticky"} gap={"60px"} alignItems={"center"}>
          <Img
            textAlign={"center"}
            src="/assets/images/Launch-Logo-Updated.png"
          />

          <AiOutlineDown style={{ fontWeight: "bold" }} fontWeight={"900"} />
        </HStack>
        <VStack width={"full"}>
          {channels.length > 0
            ? channels.map(({ id, title }) => {
                return (
                  <Link style={{ width: "100%" }} key={id} to={`/${id}`}>
                    <HStack
                      width={"full"}
                      bg={channel === id ? "#fff" : ""}
                      _hover={{ bg: "#fff" }}
                      padding={"10px"}
                      cursor={"pointer"}
                    >
                      <Text fontSize={"14px"}>{title}</Text>
                    </HStack>
                  </Link>
                );
              })
            : ""}
        </VStack>
      </VStack>
    </HStack>
  );
};

export default LeftSideBar;
