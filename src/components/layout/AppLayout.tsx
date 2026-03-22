import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MapIcon from "@mui/icons-material/Map";
import CanvasIcon from "@mui/icons-material/Brush";
import LogoutIcon from "@mui/icons-material/Logout";
import { type ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useStore } from "../../store/RootStore";
import { io } from "socket.io-client";
import { observer } from "mobx-react-lite";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = observer(({ children }: AppLayoutProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { authStore, mapStore } = useStore();

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: "Tracking (Canvas)", icon: <CanvasIcon />, path: "/with-canvas" },
    { text: "Tracking (DOM)", icon: <MapIcon />, path: "/with-dom" },
  ];

  useEffect(() => {
    const socket = io(
      import.meta.env.VITE_BACKEND_URL || "http://localhost:3001",
    );

    socket.on("connect", () => {
      console.log("Connected to tracking server");
    });

    socket.on("object_update", (data) => {
      // console.log("data", data);

      mapStore.handleBatchUpdate(data);
    });

    socket.on("status_update", (data) => {
      mapStore.handleStatusUpdate(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [mapStore]);

  const handleLogout = () => {
    authStore.logout();

    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Tracking App
          </Typography>

          <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
            {authStore.userId?.charAt(0).toUpperCase()}
          </Avatar>

          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        {children}
      </Box>
    </Box>
  );
});
