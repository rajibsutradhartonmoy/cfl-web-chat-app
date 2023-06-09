import React, { useEffect } from "react";
import Container from "../../Components/Container";
import { useAuth } from "../../hooks/useAuth";
import UnuthenticatedApp from "../../Components/UnuthenticatedApp";
import { useNavigate, useParams } from "react-router-dom";

import { getFirestore } from "firebase/firestore";
import Onboarding from "../Onboarding";

const Community = () => {
  const { user } = useAuth();
  console.log(user);
  const navigate = useNavigate();

  const params = useParams();
  useEffect(() => {
    if (user === null) {
      navigate("/onboarding");
    }
    if (!params.channelId) {
      navigate("/channles/general");
    }
  }, []);
  return <>{user !== null ? <Container /> : <Onboarding />}</>;
};

export default Community;
