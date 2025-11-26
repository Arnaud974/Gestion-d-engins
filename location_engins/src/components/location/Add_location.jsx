import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";

function Add_location({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    matricule: "",
    date_debut: "",
    date_fin: "",
    montant_total: "",
  });

  const [engins, setEngins] = useState([]);
  const [prixJour, setPrixJour] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;

  const API_URLs = `${API_URL}/api/locations`;

  // 🔹 Récupérer l'utilisateur connecté depuis localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const id_utilisateur_client = user?.id;

  // 🔹 Charger les engins disponibles
  useEffect(() => {
    if (!open) return;

    const fetchEngins = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/engins`);
        const disponibles = res.data.filter((e) => e.statut === "disponible");
        setEngins(disponibles);
      } catch {
        Swal.fire("Erreur", "Impossible de charger les engins", "error");
      }
    };

    fetchEngins();
  }, [open]);

  // 🔹 Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "matricule") {
      const engin = engins.find((e) => e.matricule === value);
      setPrixJour(engin ? engin.prix_location_jour : 0);
      setForm((prev) => ({ ...prev, [name]: value }));
      calculerMontant(form.date_debut, form.date_fin, engin ? engin.prix_location_jour : 0);
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "date_debut" || name === "date_fin") {
      calculerMontant(
        name === "date_debut" ? value : form.date_debut,
        name === "date_fin" ? value : form.date_fin,
        prixJour
      );
    }
  };

  // 🔹 Calcul du montant total automatiquement
  const calculerMontant = (dateDebut, dateFin, prix) => {
    if (!dateDebut || !dateFin || !prix) return;
    const d1 = new Date(dateDebut);
    const d2 = new Date(dateFin);
    const nbJours = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
    setForm((prev) => ({ ...prev, montant_total: nbJours > 0 ? nbJours * prix : 0 }));
  };

  // 🔹 Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id_utilisateur_client) {
      return Swal.fire("Erreur", "Utilisateur non connecté", "error");
    }

    try {
      const payload = {
        id_utilisateur_client,
        matricule: form.matricule,
        date_debut: form.date_debut,
        date_fin: form.date_fin,
        montant_total: form.montant_total,
      };

      const res = await axios.post(API_URLs, payload);

      Swal.fire("Succès", "Location ajoutée avec succès", "success");

      if (onAdd) onAdd(res.data);

      // Reset form et fermer modal
      setForm({ matricule: "", date_debut: "", date_fin: "", montant_total: "" });
      setPrixJour(0);
      onClose();
    } catch (err) {
      Swal.fire("Erreur", err.response?.data?.message || "Impossible d'ajouter la location", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter une Location</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {/* Sélecteur d'engins */}
          <FormControl fullWidth required>
            <InputLabel>Choisir un engin</InputLabel>
            <Select name="matricule" value={form.matricule} onChange={handleChange}>
              {engins.map((engin) => (
                <MenuItem key={engin.matricule} value={engin.matricule}>
                  {engin.matricule} — {engin.type_engin} ({engin.marque})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Prix par jour */}
          {prixJour > 0 && (
            <Typography variant="body2" color="text.secondary">
              💰 Prix par jour : <strong>{prixJour} Ar</strong>
            </Typography>
          )}

          <TextField
            type="date"
            label="Date Début"
            name="date_debut"
            value={form.date_debut}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            type="date"
            label="Date Fin"
            name="date_fin"
            value={form.date_fin}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            label="Montant Total"
            name="montant_total"
            value={form.montant_total}
            fullWidth
            disabled
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Annuler
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Add_location;
