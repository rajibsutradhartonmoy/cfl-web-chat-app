import React, { createContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Community from "../Pages/Community";
import Onboarding from "../Pages/Onboarding";
import UnuthenticatedApp from "../Components/UnuthenticatedApp";
import Subscribe from "../Pages/Onboarding/Subscribe";
import Chat from "../Pages/Chat";
export const ChatContext = createContext();

function Router() {
  const [otherUser, setOtherUser] = useState("");
  return (
    <ChatContext.Provider value={{ otherUser, setOtherUser }}>
      {" "}
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Onboarding />} />
          <Route exact path="/login" element={<UnuthenticatedApp />} />
          <Route exact path="/onboarding" element={<Onboarding />} />
          <Route exact path="/channels" element={<Chat />} />

          <Route exact path="/channels/:channelId" element={<Community />} />
          <Route exact path="/dms/:channelId" element={<Community />} />
          <Route
            exact
            path="/api/auth/callback/google"
            element={<Onboarding />}
          />
          <Route exact path="/subscribe" element={<Subscribe />} />
        </Routes>
      </BrowserRouter>
    </ChatContext.Provider>
  );
}

export default Router;
