import pool from "../config/db.js";

// 📄 Obtenir toutes les locations (avec client, agent et engin)
export async function getAllLocations() {
  const result = await pool.query(`
    SELECT 
      l.*, 
      c.nom AS client_nom, 
      c.prenom AS client_prenom,
      a.nom AS agent_nom,
      a.prenom AS agent_prenom,
      e.type_engin,
      e.marque,
      e.modele,
      e.prix_location_jour
    FROM location l
    JOIN utilisateur c ON l.id_utilisateur_client = c.id_utilisateur
    LEFT JOIN utilisateur a ON l.id_utilisateur_agent = a.id_utilisateur
    JOIN engin e ON l.matricule = e.matricule
    ORDER BY l.id_location DESC
  `);
  return result.rows;
}

// 📄 Créer une nouvelle location
export async function createLocation(data) {
  const { id_utilisateur_client, id_utilisateur_agent, matricule, date_debut, date_fin, montant_total } = data;

  const result = await pool.query(
    `INSERT INTO location (
        id_utilisateur_client,
        id_utilisateur_agent,
        matricule,
        date_debut,
        date_fin,
        montant_total,
        statut
     )
     VALUES ($1, $2, $3, $4, $5, $6, 'en cours')
     RETURNING *`,
    [id_utilisateur_client, id_utilisateur_agent, matricule, date_debut, date_fin, montant_total]
  );

  // Mettre l'engin en "loué"
  await pool.query("UPDATE engin SET statut='loué' WHERE matricule=$1", [matricule]);

  return result.rows[0];
}

// 📄 Modifier une location
export async function updateLocation(id, data) {
  const { statut, date_debut, date_fin, matricule } = data;

  // 🔹 Récupérer l'ancien matricule AVANT la mise à jour
  const oldLocRes = await pool.query(`SELECT matricule FROM location WHERE id_location=$1`, [id]);
  const oldMatricule = oldLocRes.rows[0]?.matricule;

  if (!matricule) throw new Error("Le matricule est requis.");

  // 🔹 Récupérer le prix par jour du nouvel engin
  const enginRes = await pool.query(`SELECT prix_location_jour FROM engin WHERE matricule=$1`, [matricule]);
  if (!enginRes.rows.length) throw new Error("Engin non trouvé");
  const prixJour = enginRes.rows[0].prix_location_jour;

  // 🔹 Calculer le montant total si dates présentes
  let montant_total = null;
  if (date_debut && date_fin) {
    const d1 = new Date(date_debut);
    const d2 = new Date(date_fin);
    const nbJours = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
    if (nbJours > 0) montant_total = nbJours * prixJour;
  }

  // 🔹 Mettre à jour la location
  const result = await pool.query(
    `UPDATE location
     SET 
       statut = COALESCE($1, statut),
       matricule = $2,
       date_debut = COALESCE($3, date_debut),
       date_fin = COALESCE($4, date_fin),
       montant_total = COALESCE($5, montant_total)
     WHERE id_location=$6
     RETURNING *`,
    [statut, matricule, date_debut, date_fin, montant_total, id]
  );

  // 🔹 Mettre à jour le statut des engins
  // Ancien engin devient disponible si le matricule a changé
  if (oldMatricule && oldMatricule !== matricule) {
    await pool.query(`UPDATE engin SET statut='disponible' WHERE matricule=$1`, [oldMatricule]);
  }

  // Nouvel engin devient loué
  await pool.query(`UPDATE engin SET statut='loué' WHERE matricule=$1`, [matricule]);

  return result.rows[0];
}

// 📄 Supprimer une location
export async function deleteLocation(id) {
  // Avant suppression, rendre l'engin disponible
  const locRes = await pool.query(`SELECT matricule FROM location WHERE id_location=$1`, [id]);
  const matricule = locRes.rows[0]?.matricule;
  if (matricule) await pool.query(`UPDATE engin SET statut='disponible' WHERE matricule=$1`, [matricule]);

  await pool.query(`DELETE FROM location WHERE id_location=$1`, [id]);
}

// 📄 Marquer automatiquement les locations expirées et rendre les engins disponibles
export async function terminerLocationsExpirees() {
  await pool.query(`
    UPDATE location
    SET statut = 'terminée'
    WHERE statut = 'en cours' AND date_fin < NOW()
  `);

  await pool.query(`
    UPDATE engin
    SET statut = 'disponible'
    WHERE matricule IN (
      SELECT matricule FROM location
      WHERE statut = 'terminée' AND date_fin < NOW()
    )
  `);
}
