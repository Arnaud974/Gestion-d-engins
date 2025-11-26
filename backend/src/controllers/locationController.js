import {
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../models/locationModel.js";
import pool from "../config/db.js";
import { updateSolde } from "../models/soldeModel.js";

// ✅ Lister toutes les locations + mise à jour automatique des statuts expirés
export async function listerLocations(req, res) {
  try {
    // 🔹 D’abord mettre à jour les locations expirées
    await pool.query(`
      UPDATE location 
      SET statut = 'terminée'
      WHERE statut = 'en cours' 
      AND date_fin < NOW()
    `);

    // 🔹 Rendre disponibles les engins dont la location est terminée
    await pool.query(`
      UPDATE engin
      SET statut = 'disponible'
      WHERE matricule IN (
        SELECT matricule FROM location
        WHERE statut = 'terminée' AND date_fin < NOW()
      )
    `);

    const locations = await getAllLocations();

    res.json({
      success: true,
      message: "Liste des locations récupérée avec succès.",
      data: locations,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des locations.",
      error: err.message,
    });
  }
}

// ✅ Créer une location
export async function creerLocation(req, res) {
  try {
    const {
      id_utilisateur_client,
      id_utilisateur_agent,
      matricule,
      date_debut,
      date_fin,
      montant_total,
    } = req.body;

    // Vérifier si l'engin est déjà loué sur cette période
    const verif = await pool.query(
      `SELECT * FROM location 
       WHERE matricule=$1 
       AND statut='en cours'
       AND (date_debut, date_fin) OVERLAPS ($2, $3)`,
      [matricule, date_debut, date_fin]
    );

    if (verif.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "❌ L'engin est déjà loué sur cette période.",
      });
    }

    // Créer la nouvelle location
    const location = await createLocation({
      id_utilisateur_client,
      id_utilisateur_agent,
      matricule,
      date_debut,
      date_fin,
      montant_total,
    });

    // Mettre à jour le statut de l'engin
    await pool.query("UPDATE engin SET statut='loué' WHERE matricule=$1", [matricule]);

    if (updateSolde) await updateSolde(montant_total);

    res.status(201).json({
      success: true,
      message: "✅ Location créée avec succès.",
      data: location,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la location.",
      error: err.message,
    });
  }
}

// ✅ Modifier une location
export async function modifierLocation(req, res) {
  try {
    const location = await updateLocation(req.params.id, req.body);

    // Si la location est terminée ou annulée → rendre l'engin disponible
    if (location?.statut === "terminée" || location?.statut === "annulée") {
      await pool.query(
        "UPDATE engin SET statut='disponible' WHERE matricule=$1",
        [location.matricule]
      );
    }

    res.json({
      success: true,
      message: "✅ Location mise à jour avec succès.",
      data: location,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de la location.",
      error: err.message,
    });
  }
}

// ✅ Supprimer une location
export async function supprimerLocation(req, res) {
  try {
    await deleteLocation(req.params.id);
    res.json({
      success: true,
      message: "🗑️ Location supprimée avec succès.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la location.",
      error: err.message,
    });
  }
}
