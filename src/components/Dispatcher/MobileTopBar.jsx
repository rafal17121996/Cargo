import { Box, Typography, IconButton } from "@mui/material";
import { Menu as HamburgerIcon, Close as CloseIcon } from "@mui/icons-material";
import PropTypes from "prop-types";

function MobileTopBar({
  userName,
  userDesignation,
  sidebarOpen,
  setSidebarOpen,
}) {
  return (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        height: 64,
        alignItems: "center",
        p: 2,
        bgcolor: "background.paper",
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
      }}
    >
      <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ mr: 2 }}>
        {sidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
      </IconButton>
      <Box>
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
    </Box>
  );
}

MobileTopBar.propTypes = {
  userName: PropTypes.string,
  userDesignation: PropTypes.string,
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};

export default MobileTopBar;
