import {
  HStack,
  VStack,
  Image,
  Button,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Container,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Form, useForm } from "react-hook-form";
import UnuthenticatedApp from "../../Components/UnuthenticatedApp";
import { useNavigate } from "react-router-dom";
const Onboarding = () => {
  const navigate = useNavigate();
  const user = useAuth();
  console.log(user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const [fullName, setFullName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user.user !== null) setFullName(user.user.displayName);
  }, [user]);

  return (
    <>
      {user.user !== null ? (
        <HStack height={"100vh"} overflow={"scroll"}>
          <VStack
            flex={1.5}
            height={"100vh"}
            justifyContent={"center"}
            width={"full"}
            alignItems={"center"}
            gap={5}
            position={"relative"}
            bgImage={"/assets/images/transparentwaves.jpg"}
          >
            <Image
              width={"200px"}
              src="/assets/images/Launch-Logo-Updated.png"
            />
            <Text fontSize>
              A few steps away from connecting with thousands of CoFounders
            </Text>

            <form style={{ width: "80%", color: "#4F5660" }}>
              <VStack width={"full"} alignItems={"flex-start"} spacing={5}>
                <Text textTransform={"capitalize"} color={"#0461b8"}>
                  Personal Information
                </Text>
                <Text fontSize={"sm"}>Tell us few details about yourself</Text>
              </VStack>
              <VStack mt={5} width={"full"} spacing={5}>
                <FormControl>
                  <FormLabel fontSize={"sm"}>Full Name</FormLabel>
                  <Input type="text" defaultValue={fullName} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={"sm"}>Name of Company</FormLabel>
                  <Input type="text" required {...register("company_name")} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={"sm"}>
                    A brief description of what you are building
                  </FormLabel>
                  <Textarea
                    type="text"
                    required
                    {...register("company_name")}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize={"sm"}>Biggest Pain point</FormLabel>
                  <Input type="text" required {...register("company_name")} />
                </FormControl>
                <Button
                  bg={"#0461b8"}
                  color={"#fff"}
                  _hover={{ bg: "#0c8ce9" }}
                  size={"lg"}
                  width={"full"}
                  onClick={() => navigate("/general")}
                  isLoading={isSubmitting}
                >
                  {" "}
                  Proceed
                </Button>
              </VStack>
            </form>
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
      ) : (
        <UnuthenticatedApp />
      )}
    </>
  );
};

export default Onboarding;
