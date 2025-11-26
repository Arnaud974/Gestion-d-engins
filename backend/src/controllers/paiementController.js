import {
  getAllPaiements,
  createPaiement,
  deletePaiement,
} from "../models/paiementModel.js";
import { updateSolde } from "../models/soldeModel.js";

export async function listerPaiements(req, res) {
  try {
    const paiements = await getAllPaiements();
    res.json(paiements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function creerPaiement(req, res) {
  try {
    const paiement = await createPaiement(req.body);

    if (paiement.statut === "payé") {
      await updateSolde(paiement.montant);
    }

    res.status(201).json(paiement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function supprimerPaiement(req, res) {
  try {
    await deletePaiement(req.params.id);
    res.json({ message: "Paiement supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
