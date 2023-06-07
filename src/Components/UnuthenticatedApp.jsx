import { HStack, VStack, Box, Image, Button } from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";
import React from "react";
import { useNavigate } from "react-router-dom";

const UnuthenticatedApp = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // console.log(user);
  if (user !== null) {
    navigate("/onboarding");
  }
  return (
    <HStack height={"100vh"} overflow={"scroll"}>
      <VStack
        flex={1.5}
        height={"100vh"}
        justifyContent={"center"}
        gap={"20px"}
      >
        <Image width={"300px"} src="/assets/images/Launch-Logo-Updated.png" />
        <Button onClick={login} size={"lg"}>
          {" "}
          Sign in with Google
        </Button>
      </VStack>
      <VStack
        flex={2}
        height={"100vh"}
        backgroundImage={
          "url(https://cofounderslab.com/assets/images/auth-splash.jpg)"
        }
        bgSize={"cover"}
        bgPosition={"center"}
      ></VStack>
    </HStack>
  );
};

export default UnuthenticatedApp;
