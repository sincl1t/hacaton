import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="layout-root">
      <Sidebar />

      <div className="layout-main">
        <header className="layout-header">
          {user && (
            <div className="header-user-section">
              <span className="header-user-email">{user.email}</span>

              <button className="header-logout-btn" onClick={logout}>
                Выйти
              </button>
            </div>
          )}
        </header>

        <div className="layout-content">
          {children}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
