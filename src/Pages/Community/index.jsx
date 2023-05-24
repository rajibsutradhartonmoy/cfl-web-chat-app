import React, { useEffect } from "react";
import Container from "../../Components/Container";
import { useAuth } from "../../hooks/useAuth";
import UnuthenticatedApp from "../../Components/UnuthenticatedApp";
import { useNavigate, useParams } from "react-router-dom";

import { getFirestore } from "firebase/firestore";

const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  useEffect(() => {
    if (!params.channelId) {
      navigate("/general");
    }
  }, []);
  return <>{user ? <Container /> : <UnuthenticatedApp />}</>;
};

export default Community;
