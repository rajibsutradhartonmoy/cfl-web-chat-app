import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Community from "../Pages/Community";
import Onboarding from "../Pages/Onboarding";
import UnuthenticatedApp from "../Components/UnuthenticatedApp";
import Subscribe from "../Pages/Onboarding/Subscribe";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Onboarding />} />
        <Route exact path="/login" element={<UnuthenticatedApp />} />
        <Route exact path="/onboarding" element={<Onboarding />} />
        <Route exact path="/:channelId" element={<Community />} />
        <Route
          exact
          path="/api/auth/callback/google"
          element={<Onboarding />}
        />
        <Route exact path="/subscribe" element={<Subscribe />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
