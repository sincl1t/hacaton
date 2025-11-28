import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Registry from "./pages/Registry";
import Compare from "./pages/Compare";
import ChatBot from "./pages/ChatBot";
import Settings from "./pages/Settings";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registry" element={<Registry />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/chat" element={<ChatBot />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Layout>
  );
}

export default App;
