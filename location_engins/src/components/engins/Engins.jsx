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
import AjoutEngins from "./ajout_engins";
import ModifierEngins from "./modifier_engins";

function Engins() {
  const [engins, setEngins] = useState([]);
  const [filteredEngins, setFilteredEngins] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedEngin, setSelectedEngin] = useState(null);
  const [role, setRole] = useState(null);
  const [search, setSearch] = useState("");

  // 🔹 Chargement initial
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    fetchEngins();
  }, []);

    const API_URL = import.meta.env.VITE_API_URL;

  // 🔹 Récupération des engins
  const fetchEngins = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/engins`);
      setEngins(res.data);
      setFilteredEngins(res.data);
    } catch {
      Swal.fire("Erreur", "Impossible de récupérer les engins", "error");
    }
  };

  // 🔍 Filtrage dynamique
  useEffect(() => {
    const filtered = engins.filter((e) => {
      const term = search.toLowerCase();
      return (
        e.matricule?.toLowerCase().includes(term) ||
        e.type_engin?.toLowerCase().includes(term) ||
        e.marque?.toLowerCase().includes(term) ||
        e.modele?.toLowerCase().includes(term) ||
        e.statut?.toLowerCase().includes(term)
      );
    });
    setFilteredEngins(filtered);
  }, [search, engins]);

  // 🗑️ Suppression d’un engin
  const handleDelete = async (matricule) => {
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
        await axios.delete(`${API_URL}/api/engins/${matricule}`);
        setEngins(engins.filter((e) => e.matricule !== matricule));
        Swal.fire({
          icon: "success",
          title: "Supprimé !",
          text: "L'engin a été supprimé.",
          confirmButtonColor: "#0369a1",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch {
        Swal.fire("Erreur", "Impossible de supprimer l'engin.", "error");
      }
    }
  };

  // ✏️ Modification
  const handleEdit = (engin) => {
    setSelectedEngin(engin);
    setOpenEdit(true);
  };

  // ✅ Mise à jour locale après modification
  const handleEnginUpdated = (updatedEngin) => {
    setEngins((prev) =>
      prev.map((e) => (e.matricule === updatedEngin.matricule ? updatedEngin : e))
    );
    setOpenEdit(false);
  };

  // ✅ Ajout d’un engin
  const handleEnginAdded = (newEngin) => {
    setEngins([...engins, newEngin]);
    setOpenAdd(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Liste des Engins
      </Typography>

      {/* 🔍 Barre de recherche */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {role === "admin" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenAdd(true)}
          >
            Ajouter un engin
          </Button>
        )}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Rechercher un engin..."
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

      {/* 🧾 Tableau des engins */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f4f8" }}>
            <TableRow>
              <TableCell>Matricule</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Marque</TableCell>
              <TableCell>Modèle</TableCell>
              <TableCell>Prix/Jour</TableCell>
              <TableCell>Statut</TableCell>
              {role === "admin" && <TableCell align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredEngins.map((engin) => (
              <TableRow key={engin.matricule} hover>
                <TableCell>{engin.matricule}</TableCell>
                <TableCell>{engin.type_engin}</TableCell>
                <TableCell>{engin.marque}</TableCell>
                <TableCell>{engin.modele}</TableCell>
                <TableCell>{engin.prix_location_jour} Ar</TableCell>
                <TableCell
                  sx={{
                    color:
                      engin.statut === "disponible"
                        ? "green"
                        : engin.statut === "en location"
                        ? "orange"
                        : "red",
                    fontWeight: 600,
                  }}
                >
                  {engin.statut}
                </TableCell>
                {role === "admin" && (
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleEdit(engin)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(engin.matricule)}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}

            {filteredEngins.length === 0 && (
              <TableRow>
                <TableCell colSpan={role === "admin" ? 7 : 6} align="center">
                  Aucun engin trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 🧩 Modals */}
      {role === "admin" && (
        <>
          <AjoutEngins
            open={openAdd}
            onClose={() => setOpenAdd(false)}
            onAdd={handleEnginAdded}
          />
          <ModifierEngins
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            engin={selectedEngin}
            onEdit={handleEnginUpdated}
          />
        </>
      )}
    </Box>
  );
}

export default Engins;
