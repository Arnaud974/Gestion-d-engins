import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import Swal from "sweetalert2";
import Update_client from "./Update_client";
import { useNavigate } from "react-router-dom";

function Client() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [filteredUtilisateurs, setFilteredUtilisateurs] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  // 🔹 Récupérer les utilisateurs
  const fetchUtilisateurs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/utilisateurs`);
      setUtilisateurs(res.data);
      setFilteredUtilisateurs(res.data);
    } catch (err) {
      console.error("Erreur récupération utilisateurs :", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  // 🔍 Filtrage en temps réel
  useEffect(() => {
    const filtered = utilisateurs.filter((u) => {
      const term = search.toLowerCase();
      return (
        u.nom?.toLowerCase().includes(term) ||
        u.prenom?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.telephone?.toLowerCase().includes(term) ||
        u.role?.toLowerCase().includes(term)
      );
    });
    setFilteredUtilisateurs(filtered);
  }, [search, utilisateurs]);

  // 🗑️ Suppression utilisateur
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/api/utilisateurs/${id}`);
        setUtilisateurs(utilisateurs.filter((u) => u.id_utilisateur !== id));

        Swal.fire({
          icon: "success",
          title: "Supprimé !",
          text: "L'utilisateur a été supprimé.",
          confirmButtonColor: "#0369a1",
        });
        navigate("/"); 
      } catch (err) {
        console.error("Erreur suppression :", err.response?.data || err.message);
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Impossible de supprimer l'utilisateur.",
          confirmButtonColor: "#0369a1",
        });
      }
    }
  };

  // ✏️ Ouvrir modal de modification
  const handleUpdate = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  // ✅ Mise à jour locale après modification
  const handleUserUpdated = (updatedUser) => {
    setUtilisateurs((prev) =>
      prev.map((u) => (u.id_utilisateur === updatedUser.id_utilisateur ? updatedUser : u))
    );
    setOpenModal(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Liste des utilisateurs
      </Typography>

      {/* Barre de recherche */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Rechercher par nom, email, rôle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Tableau des utilisateurs */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f4f8" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUtilisateurs.map((user) => (
              <TableRow key={user.id_utilisateur} hover>
                <TableCell>{user.id_utilisateur}</TableCell>
                <TableCell>{user.nom}</TableCell>
                <TableCell>{user.prenom}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.telephone}</TableCell>
                <TableCell>{user.adresse}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleUpdate(user)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(user.id_utilisateur)}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredUtilisateurs.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de modification */}
      <Update_client
        open={openModal}
        handleClose={() => setOpenModal(false)}
        utilisateur={selectedUser}
        onUpdate={handleUserUpdated}
      />
    </Box>
  );
}

export default Client;
