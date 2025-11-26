import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Tooltip,
  AppBar,
  Toolbar,
  Avatar,
  Badge,
  TextField,
  Button,
  Paper,
  Popover,
} from "@mui/material";
import {
  People as CustomersIcon,
  Person as UserIcon,
  DirectionsCar as EnginIcon,
  ShoppingCart as LocationIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@mui/material/styles";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

// Largeurs du menu
const drawerWidthOpen = 240;
const drawerWidthClosed = 64;

// Styles du menu latéral
const MotionDrawer = styled(motion.div)(() => ({
  height: "100vh",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 1300,
  background: "linear-gradient(180deg, #0ea5e9 0%, #0369a1 100%)",
  color: "white",
  overflowX: "hidden",
  boxShadow: "2px 0 8px rgba(0, 0, 0, 0.2)",
  display: "flex",
  flexDirection: "column",
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "white",
  color: theme.palette.text.primary,
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  zIndex: 1200,
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  margin: theme.spacing(0.5, 1),
  padding: theme.spacing(1.5),
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transform: "translateX(4px)",
    transition: "all 0.2s ease",
  },
}));

const NavItem = ({ item, isOpen }) => (
  <ListItem disablePadding sx={{ display: "block" }}>
    <Tooltip title={!isOpen ? item.title : ""} placement="right">
      <StyledListItemButton component={Link} to={item.path}>
        <ListItemIcon
          sx={{
            color: "white",
            minWidth: 0,
            mr: isOpen ? 2 : "auto",
            justifyContent: "center",
          }}
        >
          {item.icon}
        </ListItemIcon>
        {isOpen && <ListItemText primary={item.title} />}
      </StyledListItemButton>
    </Tooltip>
  </ListItem>
);

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!token) {
      navigate("/login", { replace: true });
    } else {
      setRole(userData?.role);
      setUser(userData);
      setFormData(userData || {});
    }
  }, [navigate]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Déconnexion",
      text: "Voulez-vous vraiment vous déconnecter ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0ea5e9",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, déconnecter",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      localStorage.clear();
      await Swal.fire({
        icon: "success",
        title: "Déconnecté !",
        text: "Vous avez été déconnecté avec succès.",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/login", { replace: true });
    }
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfile = () => {
    setAnchorEl(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const API_URL = import.meta.env.VITE_API_URL;

  const handleUpdateProfile = async () => {
    try {
      const res = await axios.put(
        `${API_URL}/api/utilisateurs/${user?.id}`,
        formData
      );
      Swal.fire({
        icon: "success",
        title: "Profil mis à jour !",
        text: "Vos informations ont été modifiées.",
        confirmButtonColor: "#0369a1",
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      handleCloseProfile();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: err.response?.data?.message || "Impossible de modifier le profil.",
        confirmButtonColor: "#0369a1",
      });
    }
  };

  const navItemsAdmin = [
    { title: "Tableau de bord", icon: <UserIcon fontSize="small" />, path: "/dashboard" },
    { title: "Clients", icon: <CustomersIcon fontSize="small" />, path: "/client" },
    { title: "Engins", icon: <EnginIcon fontSize="small" />, path: "/engins" },
    { title: "Locations", icon: <LocationIcon fontSize="small" />, path: "/location" },
  ];

  const navItemsClient = [
    { title: "Mes Locations", icon: <LocationIcon fontSize="small" />, path: "/location" },
    { title: "Engins", icon: <EnginIcon fontSize="small" />, path: "/engins" },
  ];

  const navItems =
    role === "admin"
      ? navItemsAdmin
      : role === "client"
      ? navItemsClient
      : [];

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#f9fafb",
        }}
      >
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  const open = Boolean(anchorEl);
  const id = open ? "profile-popover" : undefined;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <MotionDrawer
        animate={{ width: isOpen ? drawerWidthOpen : drawerWidthClosed }}
        transition={{ duration: 0.3 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: isOpen ? "space-between" : "center",
            px: 2,
            py: 2.5,
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {isOpen && (
            <Typography variant="h6" fontWeight="bold">
              Gestion Location
            </Typography>
          )}
          <IconButton onClick={() => setIsOpen(!isOpen)} sx={{ color: "white" }}>
            <MenuIcon fontSize="small" />
          </IconButton>
        </Box>

        <List sx={{ flex: 1, pt: 1 }}>
          {navItems.map((item, index) => (
            <NavItem key={index} item={item} isOpen={isOpen} />
          ))}
        </List>

        <Box
          sx={{
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            px: 2,
            py: 2,
          }}
        >
          <Tooltip title={!isOpen ? "Déconnexion" : ""} placement="right">
            <StyledListItemButton onClick={handleLogout}>
              <ListItemIcon
                sx={{
                  color: "white",
                  minWidth: 0,
                  mr: isOpen ? 2 : "auto",
                  justifyContent: "center",
                }}
              >
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              {isOpen && <ListItemText primary="Déconnexion" />}
            </StyledListItemButton>
          </Tooltip>
        </Box>
      </MotionDrawer>

      {/* Contenu principal */}
      <Box
        sx={{
          flexGrow: 1,
          transition: "margin-left 0.3s",
          marginLeft: isOpen ? `${drawerWidthOpen}px` : `${drawerWidthClosed}px`,
        }}
      >
        <StyledAppBar
          position="fixed"
          sx={{
            transition: "all 0.3s",
            left: isOpen ? drawerWidthOpen : drawerWidthClosed,
            width: isOpen
              ? `calc(100% - ${drawerWidthOpen}px)`
              : `calc(100% - ${drawerWidthClosed}px)`,
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" color="textPrimary" fontWeight="600">
              Tableau de bord
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip title="Rechercher">
                <IconButton color="inherit">
                  <SearchIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Notifications">
                <IconButton color="inherit">
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Paramètres">
                <IconButton color="inherit">
                  <SettingsIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Profil">
                <IconButton sx={{ ml: 1 }} onClick={handleProfileClick}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: "#0ea5e9" }}>
                    {user?.nom ? user.nom.charAt(0).toUpperCase() : "?"}
                  </Avatar>
                </IconButton>
              </Tooltip>

              {/* Popover Profil */}
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleCloseProfile}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Paper sx={{ p: 2, width: 280 }}>
                  <Typography variant="h6" gutterBottom>
                    Modifier Profil
                  </Typography>

                  <TextField
                    label="Nom"
                    name="nom"
                    fullWidth
                    margin="dense"
                    value={formData.nom || ""}
                    onChange={handleChange}
                  />
                  <TextField
                    label="Prénom"
                    name="prenom"
                    fullWidth
                    margin="dense"
                    value={formData.prenom || ""}
                    onChange={handleChange}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    margin="dense"
                    value={formData.email || ""}
                    onChange={handleChange}
                  />

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleUpdateProfile}
                  >
                    Enregistrer
                  </Button>
                </Paper>
              </Popover>
            </Box>
          </Toolbar>
        </StyledAppBar>

        <Box
          component="main"
          sx={{
            marginTop: 6,
            flexGrow: 1,
            bgcolor: "#fff",
            minHeight: "100vh",
            pt: 10,
            p: 3,
          }}
        >
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;
