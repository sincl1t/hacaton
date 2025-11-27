import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const layoutStyle = {
  display: "grid",
  gridTemplateColumns: "260px 1fr",
  height: "100vh",
  backgroundColor: "#05060a",
  color: "#ffffff"
};

const mainStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
};

const contentStyle = {
  padding: "16px",
  overflow: "auto",
};

export default function Layout({ children }) {
  return (
    <div style={layoutStyle}>
      <Sidebar />
      <div style={mainStyle}>
        <Topbar />
        <main style={contentStyle}>{children}</main>
      </div>
    </div>
  );
}
