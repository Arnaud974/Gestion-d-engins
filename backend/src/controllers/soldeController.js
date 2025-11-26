import { getSolde, updateSolde } from "../models/soldeModel.js";

export async function lireSolde(req, res) {
  try {
    const solde = await getSolde();
    res.json(solde);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function incrementerSolde(req, res) {
  try {
    const { montant } = req.body;
    await updateSolde(montant);
    res.json({ message: "Solde mis à jour avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
