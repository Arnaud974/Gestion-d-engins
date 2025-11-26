import {
  getAllEngins,
  getEnginByMatricule,
  createEngin,
  updateEngin,
  deleteEngin,
} from "../models/enginModel.js";

// Lister tous les engins
export async function listerEngins(req, res) {
  try {
    const engins = await getAllEngins();
    res.json(engins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Lire un engin
export async function lireEngin(req, res) {
  try {
    const engin = await getEnginByMatricule(req.params.matricule);
    if (!engin) return res.status(404).json({ message: "Engin non trouvé" });
    res.json(engin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Créer un engin
export async function creerEngin(req, res) {
  try {
    console.log("Données reçues:", req.body); // <-- pour debug

    const engin = await createEngin(req.body);

    res.status(201).json(engin); // <-- on renvoie directement l'objet ajouté
  } catch (err) {
    console.error("Erreur création engin:", err.message);
    res.status(500).json({ message: err.message });
  }
}

// Modifier un engin
export async function modifierEngin(req, res) {
  try {
    const engin = await updateEngin(req.params.matricule, req.body);
    res.json(engin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Supprimer un engin
export async function supprimerEngin(req, res) {
  try {
    await deleteEngin(req.params.matricule);
    res.json({ message: "Engin supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
