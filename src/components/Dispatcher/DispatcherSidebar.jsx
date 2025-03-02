import { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  Person as UserIcon,
  Group as RoleIcon,
  LocalShipping as TruckIcon,
  AirportShuttle as TrailerIcon,
  ExpandLess,
  ExpandMore,
  Logout as LogoutIcon,
  Route as RouteIcon,
  Description as TemplatesIcon,
  Business as ClientsIcon,
  Settings as AdminIcon,         
  DirectionsCar as VehiclesIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";

function DispatcherSidebar({
  userName,
  userDesignation,
  setSidebarOpen,
  activeMenu,
  setActiveMenu,
  handleLogout,
}) {
  const [adminOpen, setAdminOpen] = useState(true);
  const [vehiclesOpen, setVehiclesOpen] = useState(true);
  return (
    <Box
      sx={{
        width: { xs: "100%", md: 264 },
        height: { xs: "auto", md: "100vh" },
        bgcolor: "background.paper",
        borderRight: { md: "1px solid rgba(0, 0, 0, 0.12)" },
        position: { md: "static" },
        zIndex: 1200,
      }}
    >
      {/* User Info (Desktop) */}
      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          display: { xs: "none", md: "block" },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #4f46e5 30%, #ec4899 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {userName || "User"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {userDesignation || "Role"}
        </Typography>
      </Box>

      {/* Menu Buttons */}
      <Box sx={{ p: 2 }}>
        <List disablePadding>
          {/* Top-level items */}
          {['daily', 'templates', 'clients'].map((item) => (
            <ListItemButton
              key={item}
              selected={activeMenu === item}
              sx={{
                borderRadius: 2,
                mb: 1,
                color: activeMenu === item ? 'white' : 'text.primary',
                background: activeMenu === item 
                  ? 'linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)'
                  : 'transparent',
                '&:hover': {
                  background: activeMenu === item 
                    ? 'linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
              }}
              onClick={() => {
                setActiveMenu(item);
                setSidebarOpen(false);
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                {item === 'daily' && <RouteIcon />}
                {item === 'templates' && <TemplatesIcon />}
                {item === 'clients' && <ClientsIcon />}
              </ListItemIcon>
              <ListItemText 
                primary={
                  item === 'daily' ? 'Daily Plan' :
                  item === 'templates' ? 'Tour Templates' : 'Clients'
                } 
              />
            </ListItemButton>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* Collapsible Sections */}
          {[
            {
              id: 'administration',
              icon: <AdminIcon />,
              text: 'Administration',
              open: adminOpen,
              setOpen: setAdminOpen,
              items: [
                { id: 'users', icon: <UserIcon />, text: 'Users' },
                { id: 'roles', icon: <RoleIcon />, text: 'Roles' },
              ],
            },
            {
              id: 'vehicles',
              icon: <VehiclesIcon />,
              text: 'Vehicles',
              open: vehiclesOpen,
              setOpen: setVehiclesOpen,
              items: [
                { id: 'trucks', icon: <TruckIcon />, text: 'Trucks' },
                { id: 'trailers', icon: <TrailerIcon />, text: 'Trailers' },
              ],
            },
          ].map((section) => (
            <div key={section.id}>
              <ListItemButton 
                onClick={() => section.setOpen(!section.open)}
                sx={{
                  borderRadius: 2,
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {section.icon}
                </ListItemIcon>
                <ListItemText primary={section.text} />
                {section.open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={section.open} timeout="auto" unmountOnExit>
                <List disablePadding sx={{ pl: 3 }}>
                  {section.items.map((item) => (
                    <ListItemButton
                      key={item.id}
                      selected={activeMenu === `${section.id}/${item.id}`}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        color: activeMenu === `${section.id}/${item.id}` 
                          ? 'white' 
                          : 'text.primary',
                        background: activeMenu === `${section.id}/${item.id}`
                          ? 'linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)'
                          : 'transparent',
                        '&:hover': {
                          background: activeMenu === `${section.id}/${item.id}`
                            ? 'linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)'
                            : 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                      onClick={() => {
                        setActiveMenu(`${section.id}/${item.id}`);
                        setSidebarOpen(false);
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </div>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* Logout Button */}
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );
}

DispatcherSidebar.propTypes = {
  userName: PropTypes.string,
  userDesignation: PropTypes.string,
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
  activeMenu: PropTypes.string.isRequired,
  setActiveMenu: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default DispatcherSidebar;
