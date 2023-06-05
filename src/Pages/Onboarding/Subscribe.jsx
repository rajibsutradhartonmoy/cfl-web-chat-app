import React, { useEffect, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useAuth } from "../../hooks/useAuth";
import {
  Box,
  Button,
  Container,
  Text,
  VStack,
  HStack,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { updateUser, queryUser } from "../../services/firebase";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

const Subscribe = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubscribe = async () => {
    setIsSubmitting(true);
    const status = await updateUser("uid", user.uid, true);
    console.log(status);

    if (status === true) {
      setIsSubmitting(false);
      navigate("/general");
    }
  };
  useEffect(() => {
    if (user === null) {
      navigate("/onboarding");
    }
    const getUserStatus = async () => {
      const users = await queryUser("uid", user.uid);
      if (users.docs.length > 0) {
        // alert(users.docs[0].id);
      }
    };
    getUserStatus();
  });

  return (
    <>
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
          <Image width={"200px"} src="/assets/images/Launch-Logo-Updated.png" />
          <Text fontWeight={"bold"}>Ugrade To Free Premium</Text>
          <Text fontSize={"xl"}>
            Join our community to connect with other Cofounders
          </Text>
          <Button
            isLoading={isSubmitting}
            onClick={() => {
              onSubscribe();
            }}
          >
            Get Free Premium
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
    </>
  );
};

export default Subscribe;
