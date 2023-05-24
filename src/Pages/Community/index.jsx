import React from "react";
import Container from "../../Components/Container";
import { useAuth } from "../../hooks/useAuth";
import UnuthenticatedApp from "../../Components/UnuthenticatedApp";

const Community = () => {
  const { user } = useAuth();
  return <>{user ? <Container /> : <UnuthenticatedApp />}</>;
};

export default Community;
