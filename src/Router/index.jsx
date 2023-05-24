import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Community from "../Pages/Community";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Community />} />
        <Route exact path="/:channelId" element={<Community />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
