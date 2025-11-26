import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";

function Ajout_engins({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    matricule: "",
    type_engin: "",
    marque: "",
    modele: "",
    prix_location_jour: "",
    statut: "disponible",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async () => {
    if (!form.matricule || !form.type_engin || !form.prix_location_jour) {
      Swal.fire("Erreur", "Veuillez remplir tous les champs obligatoires", "error");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/engins`, form);
      onAdd(res.data);
      Swal.fire("Succès", "Engin ajouté avec succès", "success");
      onClose();
    } catch (err) {
      console.error("Erreur ajout :", err.response?.data || err.message);
      Swal.fire("Erreur", err.response?.data?.message || "Impossible d'ajouter l'engin", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} disableEnforceFocus>
      <DialogTitle>Ajouter un Engin</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Matricule"
          name="matricule"
          fullWidth
          value={form.matricule}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          label="Type d'engin"
          name="type_engin"
          fullWidth
          value={form.type_engin}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          label="Marque"
          name="marque"
          fullWidth
          value={form.marque}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Modèle"
          name="modele"
          fullWidth
          value={form.modele}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Prix location / jour"
          name="prix_location_jour"
          type="number"
          fullWidth
          value={form.prix_location_jour}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          label="Statut"
          name="statut"
          select
          fullWidth
          value={form.statut}
          onChange={handleChange}
        >
          <MenuItem value="disponible">Disponible</MenuItem>
          <MenuItem value="loué">Loué</MenuItem>
          <MenuItem value="entretien">Entretien</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Ajout_engins;
