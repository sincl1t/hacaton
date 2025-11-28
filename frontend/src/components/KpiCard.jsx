import React from "react";

export default function KpiCard({ label, value, sub }) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        background:
          "linear-gradient(135deg, rgba(217,78,104,0.3), rgba(10,15,24,1))",
        border: "1px solid #2b3040",
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: 12, color: "#c2c6d0", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 600 }}>{value}</div>
      {sub && (
        <div style={{ fontSize: 11, color: "#9da3b5", marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  );
}
