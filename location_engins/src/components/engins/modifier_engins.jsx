import React, { useState, useEffect } from "react";
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

function ModifierEngins({ open, onClose, engin, onEdit }) {
  const [form, setForm] = useState(engin || {});

  useEffect(() => {
    setForm(engin || {});
  }, [engin]);

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
      // Requête PUT pour modifier l'engin
      const res = await axios.put(
        `${API_URL}/api/engins/${form.matricule}`,
        form
      );

      // Mettre à jour le tableau des engins dans le parent
      onEdit(res.data);
      Swal.fire("Succès", "Engin modifié avec succès", "success");
      onClose();
    } catch (err) {
      console.error("Erreur modification :", err.response?.data || err.message);
      Swal.fire(
        "Erreur",
        err.response?.data?.message || "Impossible de modifier l'engin",
        "error"
      );
    }
  };

  if (!engin) return null;

  return (
    <Dialog open={open} onClose={onClose} disableEnforceFocus>
      <DialogTitle>Modifier un Engin</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Matricule"
          name="matricule"
          fullWidth
          value={form.matricule}
          disabled
        />
        <TextField
          margin="dense"
          label="Type d'engin"
          name="type_engin"
          fullWidth
          value={form.type_engin || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Marque"
          name="marque"
          fullWidth
          value={form.marque || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Modèle"
          name="modele"
          fullWidth
          value={form.modele || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Prix location / jour"
          name="prix_location_jour"
          type="number"
          fullWidth
          value={form.prix_location_jour || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Statut"
          name="statut"
          select
          fullWidth
          value={form.statut || ""}
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
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModifierEngins;
