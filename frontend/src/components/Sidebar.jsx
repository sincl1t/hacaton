import React from "react";
import { NavLink } from "react-router-dom";


const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
};

const IconDashboard = () => (
  <svg {...iconProps}>
    <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <rect x="14" y="3" width="7" height="5" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <rect x="14" y="11" width="7" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const IconRegistry = () => (
  <svg {...iconProps}>
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <line x1="8" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.4" />
    <line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.4" />
    <line x1="8" y1="17" x2="13" y2="17" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const IconCompare = () => (
  <svg {...iconProps}>
    <path
      d="M8 4L5 8H11L8 4Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 20L19 16H13L16 20Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M8 8V20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M16 4V16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const IconChat = () => (
  <svg {...iconProps}>
    <rect
      x="3"
      y="4"
      width="18"
      height="14"
      rx="3"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M9 18L8 21L12 18H9Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="11" r="1" fill="currentColor" />
    <circle cx="12" cy="11" r="1" fill="currentColor" />
    <circle cx="15" cy="11" r="1" fill="currentColor" />
  </svg>
);

const IconSettings = () => (
  <svg {...iconProps}>
    <path
      d="M12 9.5C10.6193 9.5 9.5 10.6193 9.5 12C9.5 13.3807 10.6193 14.5 12 14.5C13.3807 14.5 14.5 13.3807 14.5 12C14.5 10.6193 13.3807 9.5 12 9.5Z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M5.5 12C5.5 11.64 5.53 11.29 5.58 10.94L3.5 9.5L4.8 6.8L7.23 7.28C7.73 6.89 8.28 6.56 8.87 6.31L9.2 3.7H12.8L13.13 6.31C13.72 6.56 14.27 6.89 14.77 7.28L17.2 6.8L18.5 9.5L16.42 10.94C16.47 11.29 16.5 11.64 16.5 12C16.5 12.36 16.47 12.71 16.42 13.06L18.5 14.5L17.2 17.2L14.77 16.72C14.27 17.11 13.72 17.44 13.13 17.69L12.8 20.3H9.2L8.87 17.69C8.28 17.44 7.73 17.11 7.23 16.72L4.8 17.2L3.5 14.5L5.58 13.06C5.53 12.71 5.5 12.36 5.5 12Z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


const iconWrapperStyle = {
  width: 20,
  height: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const labelStyle = {
  flex: 1,
};

const badgeStyle = {
  fontSize: 10,
  padding: "1px 6px",
  borderRadius: 999,
  border: "1px solid #3a3f52",
  color: "#9da3b5",
};

const navLinkClassName = ({ isActive }) =>
  "sidebar-link" + (isActive ? " sidebar-link--active" : "");

export default function Sidebar() {
  return (
    <aside
      style={{
        padding: "18px 14px 16px 14px",
        borderRight: "1px solid #202331",
        backgroundColor: "#0a0d16",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {/* Логотип / заголовок */}
      <div style={{ paddingInline: 2 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: 0.4,
            marginBottom: 4,
          }}
        >
          Web/DA
        </div>
        <div style={{ fontSize: 11, color: "#9da3b5" }}>
          Реестр контента · MWS Tables
        </div>
      </div>

      <div
        style={{
          marginTop: 2,
          borderTop: "1px solid #202331",
        }}
      />

      {/* Навигация */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 0.12,
            color: "#6f7484",
            marginBottom: 4,
            paddingInline: 2,
          }}
        >
          Навигация
        </div>

        <NavLink to="/dashboard" className={navLinkClassName}>
          <span className="sidebar-link-icon" style={iconWrapperStyle}>
            <IconDashboard />
          </span>
          <span style={labelStyle}>Dashboard</span>
        </NavLink>

        <NavLink to="/registry" className={navLinkClassName}>
          <span className="sidebar-link-icon" style={iconWrapperStyle}>
            <IconRegistry />
          </span>
          <span style={labelStyle}>Реестр контента</span>
        </NavLink>

        <NavLink to="/compare" className={navLinkClassName}>
          <span className="sidebar-link-icon" style={iconWrapperStyle}>
            <IconCompare />
          </span>
          <span style={labelStyle}>Сравнение</span>
        </NavLink>

        <NavLink to="/chat" className={navLinkClassName}>
          <span className="sidebar-link-icon" style={iconWrapperStyle}>
            <IconChat />
          </span>
          <span style={labelStyle}>Чат-бот (LLM)</span>
          <span style={badgeStyle}>beta</span>
        </NavLink>

        <NavLink to="/settings" className={navLinkClassName}>
          <span className="sidebar-link-icon" style={iconWrapperStyle}>
            <IconSettings />
          </span>
          <span style={labelStyle}>Источники</span>
        </NavLink>
      </nav>
    </aside>
  );
}
