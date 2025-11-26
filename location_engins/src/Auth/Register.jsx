import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  InputAdornment,
  Link,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Badge as RoleIcon,
  ErrorOutline as ErrorIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "",
    confirmer_mot_de_passe: "",
    telephone: "",
    adresse: "",
    role: "",
    statut_compte: "actif",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validation instantanée
    if (name === "mot_de_passe" || name === "confirmer_mot_de_passe") {
      validatePasswords({ ...formData, [name]: value });
    }
  };

  const validatePasswords = (data) => {
    let newErrors = {};

    if (!data.mot_de_passe) {
      newErrors.mot_de_passe = "Le mot de passe ne peut pas être vide.";
    } else if (data.mot_de_passe.length < 6) {
      newErrors.mot_de_passe = "Le mot de passe doit contenir au moins 6 caractères.";
    }

    if (!data.confirmer_mot_de_passe) {
      newErrors.confirmer_mot_de_passe = "Veuillez confirmer le mot de passe.";
    } else if (data.mot_de_passe !== data.confirmer_mot_de_passe) {
      newErrors.confirmer_mot_de_passe = "Les mots de passe ne correspondent pas.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validatePasswords(formData);
    if (!isValid) return;

    try {
      const res = await axios.post(`${API_URL}/api/utilisateurs`, {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        mot_de_passe: formData.mot_de_passe,
        telephone: formData.telephone,
        adresse: formData.adresse,
        role: formData.role,
        statut_compte: formData.statut_compte,
      });
      console.log("✅ Réponse backend :", res.data);

      Swal.fire({
        icon: "success",
        title: "Inscription réussie ✅",
        text: "Votre compte a été créé avec succès.",
        confirmButtonColor: "#0369a1",
      }).then(() => navigate("/"));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Erreur d'inscription",
        text:
          err.response?.data?.message ||
          "Une erreur est survenue lors de l’inscription.",
        confirmButtonColor: "#0369a1",
      });
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 30 }}
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
          p: 3,
          width: "100%",
          maxWidth: 440,
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          align="center"
          sx={{ mb: 1 }}
        >
          🧾 Inscription
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Nom */}
          <TextField
            fullWidth
            size="small"
            margin="dense"
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          {/* Prénom */}
          <TextField
            fullWidth
            size="small"
            margin="dense"
            label="Prénom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          {/* Email */}
          <TextField
            fullWidth
            size="small"
            margin="dense"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          {/* Mot de passe */}
          <TextField
            fullWidth
            size="small"
            margin="dense"
            label="Mot de passe"
            name="mot_de_passe"
            type={showPassword ? "text" : "password"}
            value={formData.mot_de_passe}
            onChange={handleChange}
            required
            error={!!errors.mot_de_passe}
            helperText={
              errors.mot_de_passe && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "red" }}>
                  <ErrorIcon fontSize="small" /> {errors.mot_de_passe}
                </Box>
              )
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Confirmer le mot de passe */}
          <TextField
            fullWidth
            size="small"
            margin="dense"
            label="Confirmer le mot de passe"
            name="confirmer_mot_de_passe"
            type={showConfirm ? "text" : "password"}
            value={formData.confirmer_mot_de_passe}
            onChange={handleChange}
            required
            error={!!errors.confirmer_mot_de_passe}
            helperText={
              errors.confirmer_mot_de_passe && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "red" }}>
                  <ErrorIcon fontSize="small" /> {errors.confirmer_mot_de_passe}
                </Box>
              )
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirm(!showConfirm)}
                    edge="end"
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Téléphone */}
          <TextField
            fullWidth
            size="small"
            margin="dense"
            label="Téléphone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          {/* Adresse */}
          <TextField
            fullWidth
            size="small"
            margin="dense"
            label="Adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          {/* Rôle */}
          <TextField
            select
            fullWidth
            size="small"
            margin="dense"
            label="Rôle"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RoleIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="admin">Administrateur</MenuItem>
            <MenuItem value="client">Client</MenuItem>
          </TextField>

          {/* Bouton */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              py: 1,
              backgroundColor: "#0284c7",
              "&:hover": { backgroundColor: "#0369a1" },
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            S'inscrire
          </Button>

          {/* Lien */}
          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 1.5, color: "gray", fontSize: "0.8rem" }}
          >
            Vous avez déjà un compte ?{" "}
            <Link
              component="button"
              onClick={() => navigate("/")}
              sx={{
                color: "#0284c7",
                fontWeight: "bold",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
                fontSize: "0.8rem",
              }}
            >
              Connectez-vous ici
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default Register;
