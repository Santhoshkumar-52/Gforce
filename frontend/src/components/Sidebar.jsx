import React, { useState } from "react";
import {
  FaHome,
  FaTicketAlt,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaChartBar,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";
import { MdPointOfSale } from "react-icons/md";
import "../styles/sidebar.css";
import useAuthStore from "../store/useStore.js";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Sales", icon: <MdPointOfSale />, path: "/sales" },
    { name: "Members", icon: <FaUsers />, path: "/member" },
    { name: "Reports", icon: <FaChartBar />, path: "/reports" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className={`z-99 h-screen flex flex-col transition-all duration-300
    ${isOpen ? "w-50" : "w-15"}`}
      style={{
        backgroundColor: "var(--sidebar-bg)",
        color: "var(--sidebar-text)",
      }}
    >
      {/* Top: Logo + Toggle */}
      <div
        className="flex items-center justify-between p-4 border-b"
        style={{ borderColor: "var(--sidebar-border)" }}
      >
        {isOpen && <span className="font-bold text-lg">Geforce</span>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:rounded"
          style={{ backgroundColor: "var(--sidebar-hover)" }}
        >
          <FaBars />
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded mx-2 my-1 ${
                isActive ? "bg-[#2e2e2e]" : ""
              }`
            }
            style={{ color: "var(--sidebar-text)" }}
          >
            <span className="text-lg">{item.icon}</span>
            {isOpen && <span>{item.name}</span>}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div
        className="p-4 border-t mt-auto"
        style={{ borderColor: "var(--sidebar-logout-border)" }}
      >
        <button
          className="flex items-center gap-3 w-full p-2 rounded"
          onClick={handleLogout}
          style={{ color: "var(--sidebar-text)" }}
        >
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
