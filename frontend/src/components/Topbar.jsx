import React from "react";

export default function Topbar() {
  return (
    <header
      style={{
        height: 56,
        borderBottom: "1px solid #202331",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        backgroundColor: "#05060a",
      }}
    >
      <div style={{ fontSize: 14, color: "#9da3b5" }}>
        Умный реестр контента в MWS Tables
      </div>
      <div style={{ fontSize: 12, color: "#9da3b5" }}>
        Хакатон · {new Date().getFullYear()}
      </div>
    </header>
  );
}
