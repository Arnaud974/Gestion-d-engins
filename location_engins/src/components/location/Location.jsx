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
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import Add_location from "./Add_location";
import Update_location from "./Update_location";

// 🔹 Fonction pour extraire YYYY-MM-DD depuis ISO sans décalage
const toLocalDateString = (isoString) => {
  if (!isoString) return "";
  return isoString.split("T")[0];
};

function Location() {
  const [locations, setLocations] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const role = localStorage.getItem("role");
  const id_utilisateur = localStorage.getItem("id_utilisateur");

    const API_URL = import.meta.env.VITE_API_URL;

  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/locations`);
      setLocations(res.data.data);
    } catch {
      Swal.fire("Erreur", "Impossible de récupérer les locations", "error");
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleDelete = async (id_location) => {
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
        await axios.delete(`${API_URL}/api/locations/${id_location}`);
        setLocations(locations.filter((loc) => loc.id_location !== id_location));
        Swal.fire("Supprimé", "La location a été supprimée", "success");
      } catch {
        Swal.fire("Erreur", "Impossible de supprimer la location", "error");
      }
    }
  };

  const handleEdit = (location) => {
    setSelectedLocation(location);
    setOpenEdit(true);
  };

  const displayedLocations =
    role === "admin"
      ? locations
      : locations.filter((loc) => loc.id_utilisateur_client === Number(id_utilisateur));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Liste des Locations
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => setOpenAdd(true)}
      >
        Ajouter une location
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Engin</TableCell>
              <TableCell>Date début</TableCell>
              <TableCell>Date fin</TableCell>
              <TableCell>Montant total</TableCell>
              <TableCell>Statut</TableCell>
              {role === "admin" && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedLocations.length > 0 ? (
              displayedLocations.map((loc) => (
                <TableRow key={loc.id_location}>
                  <TableCell>{loc.id_location}</TableCell>
                  <TableCell>{loc.client_nom} {loc.client_prenom}</TableCell>
                  <TableCell>{loc.type_engin} ({loc.marque} {loc.modele})</TableCell>
                  <TableCell>{toLocalDateString(loc.date_debut)}</TableCell>
                  <TableCell>{toLocalDateString(loc.date_fin)}</TableCell>
                  <TableCell>{loc.montant_total} Ar</TableCell>
                  <TableCell>{loc.statut}</TableCell>
                  {role === "admin" && (
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleEdit(loc)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(loc.id_location)}
                      >
                        Supprimer
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={role === "admin" ? 8 : 7} align="center">
                  Aucune location trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Add_location
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAdd={(newLoc) => setLocations([...locations, newLoc])}
      />

      {selectedLocation && (
        <Update_location
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          location={selectedLocation}
          onUpdate={(updated) => {
            setLocations(
              locations.map((loc) =>
                loc.id_location === updated.id_location ? updated : loc
              )
            );
          }}
        />
      )}
    </Box>
  );
}

export default Location;
