import React, { useState, useEffect } from "react";
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

function UpdateLocation({ location, open, onClose, onUpdate }) {
    const API_URL = import.meta.env.VITE_API_URL;

  const API_URLs = `${API_URL}/api/locations`;

  const [form, setForm] = useState({
    matricule: "",
    date_debut: "",
    date_fin: "",
    statut: "",
    montant_total: 0,
  });
  const [engins, setEngins] = useState([]);
  const [prixJour, setPrixJour] = useState(0);

  const toLocalDateString = (isoString) => {
    if (!isoString) return "";
    return isoString.split("T")[0];
  };

  useEffect(() => {
    if (!location) return;

    setForm({
      matricule: location.matricule,
      date_debut: toLocalDateString(location.date_debut),
      date_fin: toLocalDateString(location.date_fin),
      statut: location.statut,
      montant_total: location.montant_total,
    });

    setPrixJour(location.prix_location_jour || 0);
  }, [location]);

  useEffect(() => {
    if (!open) return;

    const fetchEngins = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/engins`);
        const disponibles = res.data.filter(
          (e) => e.statut === "disponible" || e.matricule === location?.matricule
        );
        setEngins(disponibles);
      } catch {
        Swal.fire("Erreur", "Impossible de charger les engins", "error");
      }
    };
    fetchEngins();
  }, [open, location]);

  const calculerMontant = (dateDebut, dateFin, prix) => {
    if (!dateDebut || !dateFin || !prix) return;

    const [y1, m1, d1] = dateDebut.split("-").map(Number);
    const [y2, m2, d2] = dateFin.split("-").map(Number);

    const dStart = new Date(y1, m1 - 1, d1);
    const dEnd = new Date(y2, m2 - 1, d2);

    const nbJours = Math.ceil((dEnd - dStart) / (1000 * 60 * 60 * 24)) + 1;
    setForm((prev) => ({
      ...prev,
      montant_total: nbJours > 0 ? nbJours * prix : 0,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        matricule: form.matricule,
        date_debut: form.date_debut,
        date_fin: form.date_fin,
        statut: form.statut,
      };
      const res = await axios.put(`${API_URLs}/${location.id_location}`, payload);

      Swal.fire("Succès", "Location mise à jour !", "success");

      if (onUpdate) onUpdate(res.data);

      onClose();
    } catch (err) {
      Swal.fire(
        "Erreur",
        err.response?.data?.message || "Impossible de mettre à jour la location",
        "error"
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier la Location #{location?.id_location}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <FormControl fullWidth required>
            <InputLabel>Engin</InputLabel>
            <Select name="matricule" value={form.matricule} onChange={handleChange}>
              {engins.map((engin) => (
                <MenuItem key={engin.matricule} value={engin.matricule}>
                  {engin.matricule} — {engin.type_engin} ({engin.marque})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {prixJour > 0 && (
            <Typography variant="body2" color="text.secondary">
              💰 Prix par jour : <strong>{prixJour} Ar</strong>
            </Typography>
          )}

          <TextField
            label="Date Début"
            type="date"
            name="date_debut"
            value={form.date_debut}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />

          <TextField
            label="Date Fin"
            type="date"
            name="date_fin"
            value={form.date_fin}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />

          <TextField
            label="Montant Total"
            name="montant_total"
            value={form.montant_total}
            fullWidth
            disabled
          />

          <FormControl fullWidth>
            <InputLabel>Statut</InputLabel>
            <Select name="statut" value={form.statut} onChange={handleChange}>
              <MenuItem value="en cours">En cours</MenuItem>
              <MenuItem value="terminée">Terminée</MenuItem>
              <MenuItem value="annulée">Annulée</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Annuler
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="success">
          Mettre à jour
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateLocation;
