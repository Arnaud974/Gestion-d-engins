import {
  getAllUtilisateurs,
  getUtilisateurById,
  createUtilisateur,
  updateUtilisateur,
  deleteUtilisateur,
  loginUtilisateur,
} from "../models/utilisateurModel.js";

import jwt from "jsonwebtoken";

// 📋 Lister tous les utilisateurs
export async function listerUtilisateurs(req, res) {
  try {
    const utilisateurs = await getAllUtilisateurs();
    res.json(utilisateurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// 📖 Lire un utilisateur par ID
export async function lireUtilisateur(req, res) {
  try {
    const utilisateur = await getUtilisateurById(req.params.id);
    if (!utilisateur)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(utilisateur);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ➕ Créer un utilisateur
export async function creerUtilisateur(req, res) {
  try {
    const utilisateur = await createUtilisateur(req.body);
    res.status(201).json({
      message: "Utilisateur ajouté avec succès",
      utilisateur,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ✏️ Modifier un utilisateur
export async function modifierUtilisateur(req, res) {
  try {
    const utilisateur = await updateUtilisateur(req.params.id, req.body);
    res.json({
      message: "Utilisateur modifié avec succès",
      utilisateur,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// ❌ Supprimer un utilisateur
export async function supprimerUtilisateur(req, res) {
  try {
    await deleteUtilisateur(req.params.id);
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// 🔐 Connexion utilisateur (login)
export async function connexionUtilisateur(req, res) {
  const { email, mot_de_passe } = req.body;

  try {
    const result = await loginUtilisateur(email, mot_de_passe);

    if (!result.success) {
      return res.status(401).json({ message: result.message });
    }

    const user = result.user;

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id_utilisateur, email: user.email, role: user.role },
      "ma_cle_secrete_temporaire", // ⚠️ À changer par une clé dans .env
      { expiresIn: "2h" }
    );

    res.json({
      message: "Connexion réussie ✅",
      utilisateur: {
        id: user.id_utilisateur,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Erreur connexion :", err);
    res.status(500).json({ message: "Erreur serveur 🚨" });
  }
}
