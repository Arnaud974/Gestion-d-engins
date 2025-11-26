import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

function Update_client({ open, handleClose, utilisateur, onUpdate }) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    role: "",
    statut_compte: "actif",
  });

  useEffect(() => {
    if (utilisateur) {
      setFormData({ ...utilisateur });
    }
  }, [utilisateur]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_URL}/api/utilisateurs/${utilisateur.id_utilisateur}`,
        formData
      );

      onUpdate(res.data.utilisateur);
      handleClose();

      Swal.fire({
        icon: "success",
        title: "Utilisateur modifié",
        text: "La modification a été effectuée avec succès !",
        confirmButtonColor: "#0369a1",
      });
    } catch (err) {
      console.error("Erreur mise à jour :", err.response?.data || err.message);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de modifier l'utilisateur.",
        confirmButtonColor: "#0369a1",
      });
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Modifier l'utilisateur
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="dense"
            label="Nom"
            name="nom"
            value={formData.nom || ""}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            label="Prénom"
            name="prenom"
            value={formData.prenom || ""}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            label="Téléphone"
            name="telephone"
            value={formData.telephone || ""}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Adresse"
            name="adresse"
            value={formData.adresse || ""}
            onChange={handleChange}
          />
          <TextField
            select
            fullWidth
            margin="dense"
            label="Rôle"
            name="role"
            value={formData.role || ""}
            onChange={handleChange}
          >
            <MenuItem value="admin">Administrateur</MenuItem>
            <MenuItem value="client">Client</MenuItem>
          </TextField>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleClose} sx={{ mr: 1 }}>
              Annuler
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Modifier
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default Update_client;
