import React from "react";
import { Avatar, HStack, Img, Text, VStack, Box } from "@chakra-ui/react";
import { AiOutlineDown } from "react-icons/ai";
import ChatAvatar from "./ChatAvatar";
import { Link, useParams } from "react-router-dom";
import {
  FaGamepad,
  FaLaptopCode,
  FaLightbulb,
  FaNewspaper,
} from "react-icons/fa";
import {
  BsFillPeopleFill,
  BsFillMicMuteFill,
  BsHeadphones,
} from "react-icons/bs";
import { IoIosPeople, IoMdSettings } from "react-icons/io";
const sideBarImage = [
  "https://i.postimg.cc/ZK7ngyd5/img1.png",
  "https://i.postimg.cc/Gm623wz0/img2.png",
  "https://i.postimg.cc/qRTvns9j/img3.png",
  "https://i.postimg.cc/W4r4hWfd/img4.png",
];
const channels = [
  {
    id: "general",
    title: "💬 General 💬",
    icon: <FaGamepad fontSize={"24px"} />,
  },
  {
    id: "tech",
    title: "💻 Science & Tech 💻",
    icon: <FaLaptopCode fontSize={"24px"} />,
  },
  { id: "idea", title: "💡 Ideas 💡", icon: <FaLightbulb fontSize={"24px"} /> },
  { id: "news", title: "🗞 News 🗞", icon: <FaNewspaper fontSize={"24px"} /> },
  {
    id: "mentorship",
    title: "🥸 Mentorship 🥸",
    icon: <BsFillPeopleFill fontSize={"24px"} />,
  },
  {
    id: "community",
    title: "🧑‍🤝‍🧑 Community 🧑‍🤝‍🧑",
    icon: <IoIosPeople fontSize={"24px"} />,
  },
];
const LeftSideBar = (props) => {
  const params = useParams();
  const channel = params.channelId;
  return (
    <HStack height={"100vh"} spacing={0} flex={2}>
      <VStack bg={"#e3e5e8"} gap={"50px"} height={"100vh"} p={"10px"}>
        <ChatAvatar />
        <VStack justifyContent={"space-between"} gap={"10px"}>
          {sideBarImage.map((image, id) => {
            return <ChatAvatar key={id} image_url={image} showActive={true} />;
          })}
        </VStack>
      </VStack>
      <VStack
        background={"#f2f3f5"}
        height={"100vh"}
        overflowY={"scroll"}
        position={"relative"}
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
            ? channels.map(({ id, title, icon }) => {
                return (
                  <Link style={{ width: "100%" }} key={id} to={`/${id}`}>
                    <HStack
                      justifyContent={"flex-start"}
                      borderRadius={"5px"}
                      width={"full"}
                      bg={channel === id ? "#5865F2" : ""}
                      _hover={{ bg: "#5865F2", color: "#fff" }}
                      gap={"1"}
                      padding={"10px"}
                      cursor={"pointer"}
                      color={channel === id ? "#fff" : ""}
                    >
                      {icon}
                      <Text fontSize={"14px"}>{title}</Text>
                    </HStack>
                  </Link>
                );
              })
            : ""}
        </VStack>
        <Box padding={2} position={"absolute"} bottom={4} mx={1} width={"full"}>
          <HStack
            padding={1}
            bg={"#D9D9D9"}
            width={"full"}
            borderRadius={"10px"}
            alignItems={"center"}
          >
            <Avatar size={"sm"} />
            <VStack alignItems={"flex-start"} spacing={0}>
              <Text fontSize={"12px"} color={"#4F5660"} fontWeight={"500"}>
                {props.displayName.slice(0, 9)} ...
              </Text>
              <Text fontSize={"10px"}> #{props.userId.slice(0, 5)}...</Text>
            </VStack>
            <BsFillMicMuteFill color="#4F5660" fontSize={"20px"} />
            <BsHeadphones color="#4F5660" fontSize={"20px"} />
            <IoMdSettings color="#4F5660" fontSize={"20px"} />
          </HStack>
        </Box>
      </VStack>
    </HStack>
  );
};

export default LeftSideBar;
