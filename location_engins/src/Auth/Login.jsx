import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  Link,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Login as LoginIcon,
} from "@mui/icons-material";

function Login() {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;


  const [formData, setFormData] = useState({
    email: "",
    mot_de_passe: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.mot_de_passe) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez remplir tous les champs.",
        confirmButtonColor: "#0369a1",
      });
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/utilisateurs/login`,
        formData
      );

      const user = res.data.utilisateur;
      const token = res.data.token;

      // 🔥 Stockage du token et rôle
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      Swal.fire({
        icon: "success",
        title: "Connexion réussie ✅",
        text: `Bienvenue ${user.prenom} !`,
        confirmButtonColor: "#0369a1",
      }).then(() => {
        // Redirection selon rôle
        if (user.role === "admin") {
          navigate("/dashboard"); // page admin
        } else {
          navigate("/client"); // page client
        }
      });
    } catch (err) {
      console.error("Erreur login :", err.response?.data || err.message);
      Swal.fire({
        icon: "error",
        title: "Erreur de connexion",
        text:
          err.response?.data?.message || "Email ou mot de passe incorrect ❌",
        confirmButtonColor: "#0369a1",
      });
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0ea5e9, #0369a1)",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
          🔐 Connexion
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            size="small"
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            size="small"
            label="Mot de passe"
            name="mot_de_passe"
            type="password"
            value={formData.mot_de_passe}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            startIcon={<LoginIcon />}
            sx={{
              mt: 3,
              py: 1.2,
              backgroundColor: "#0284c7",
              "&:hover": { backgroundColor: "#0369a1" },
              borderRadius: 2,
            }}
          >
            Se connecter
          </Button>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 3, color: "gray" }}
          >
            Vous n'avez pas de compte ?{" "}
            <Link
              component="button"
              onClick={() => navigate("/register")}
              sx={{
                color: "#0284c7",
                fontWeight: "bold",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Créez-en un ici
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
