import pool from "../config/db.js";

// Récupérer tous les engins
export async function getAllEngins() {
  const result = await pool.query("SELECT * FROM engin ORDER BY matricule");
  return result.rows;
}

// Récupérer un engin par matricule
export async function getEnginByMatricule(matricule) {
  const result = await pool.query("SELECT * FROM engin WHERE matricule=$1", [matricule]);
  return result.rows[0];
}

// Créer un engin
export async function createEngin(data) {
  const { matricule, type_engin, marque, modele, prix_location_jour, statut = "disponible" } = data;

  // Vérification simple pour éviter NULL en base
  if (!matricule || !type_engin || !prix_location_jour) {
    throw new Error("Matricule, type d'engin et prix sont obligatoires.");
  }

  const result = await pool.query(
    `INSERT INTO engin (matricule, type_engin, marque, modele, prix_location_jour, statut)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [matricule, type_engin, marque, modele, prix_location_jour, statut]
  );

  return result.rows[0]; // <-- on renvoie bien l'objet ajouté
}

// Mettre à jour un engin
export async function updateEngin(matricule, data) {
  const { type_engin, marque, modele, prix_location_jour, statut } = data;

  const result = await pool.query(
    `UPDATE engin 
     SET type_engin=$1, marque=$2, modele=$3, prix_location_jour=$4, statut=$5
     WHERE matricule=$6 RETURNING *`,
    [type_engin, marque, modele, prix_location_jour, statut, matricule]
  );

  return result.rows[0];
}

// Supprimer un engin
export async function deleteEngin(matricule) {
  await pool.query("DELETE FROM engin WHERE matricule=$1", [matricule]);
}
