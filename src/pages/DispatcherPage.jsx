import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Drawer } from "@mui/material";

import Users from "./Users";

import MobileTopBar from "../components/Dispatcher/MobileTopBar";
import DispatcherSidebar from "../components/Dispatcher/DispatcherSidebar";
import useUserData from "../hooks/useUserData";
import api from "../api/api";
import capitalizeFirstLetter from "../hooks/helpers";
import Roles from "./Roles";
import Trucks from "./Trucks";
import Trailers from "./Trailers";
import Clients from "./Clients";
import Tours from "./Tours";


function DispatcherPage() {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userData, clearUserData } = useUserData();
  const sidebarRef = useRef(null);
  const [sidebarHeight, setSidebarHeight] = useState(0);

  const userName =
    capitalizeFirstLetter(userData.first_name) +
    " " +
    capitalizeFirstLetter(userData.last_name);
  const userRole = capitalizeFirstLetter(userData.role);

  const updateUserOnlineStatus = async (status) => {
    if (!userData || !userData.id) {
      return;
    }
    try {
      await api.put(`/users/${userData.id}`, { is_online: status });
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleLogout = async () => {
    await updateUserOnlineStatus(false);
    clearUserData();
    navigate("/");
  };

  // Decide which component to show in the main content
  const renderContent = () => {
    switch (activeMenu) {
      case "daily":
        return "Hello";
      case "templates":
        return <Tours />;
      case "clients":
        return <Clients />
      case "administration/users":
        return <Users />;
      case "administration/roles":
        return <Roles />;
      case "vehicles/trucks":
        return <Trucks />;
      case "vehicles/trailers":
        return <Trailers />;
      default:
        return <Users />;
    }
  };

  useEffect(() => {
    if (sidebarOpen && sidebarRef.current) {
      setSidebarHeight(sidebarRef.current.clientHeight);
    } else {
      setSidebarHeight(0);
    }
  }, [sidebarOpen]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
      }}
    >
      {/* Mobile Top Bar */}
      <MobileTopBar
        userName={userName}
        userDesignation={userRole}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Mobile Drawer (Top-aligned) */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        anchor="top"
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: "100%",
            height: "auto",
            boxSizing: "border-box",
            marginTop: "64px",
          },
        }}
      >
        <Box ref={sidebarRef}>
          <DispatcherSidebar
            userName={userName}
            userDesignation={userRole}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            handleLogout={handleLogout}
          />
        </Box>
      </Drawer>

      {/* Desktop Sidebar */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <DispatcherSidebar
          userName={userName}
          userDesignation={userRole}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          handleLogout={handleLogout}
        />
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: {
            xs: `calc(64px + ${sidebarHeight}px)`, // 64px for MobileTopBar + menu height
            md: 0,
          },
          transition: "margin 0.3s ease",
          "&:hover": {
            boxShadow: { xs: "none", md: "0px 6px 16px rgba(0, 0, 0, 0.15)" },
          },
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}

export default DispatcherPage;
