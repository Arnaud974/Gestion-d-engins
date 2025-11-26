import pool from "../config/db.js";

export async function getAllPaiements() {
  const result = await pool.query("SELECT * FROM paiement ORDER BY id_paiement DESC");
  return result.rows;
}

export async function createPaiement(data) {
  const { id_location, montant, mode_paiement, statut } = data;
  const result = await pool.query(
    `INSERT INTO paiement (id_location, montant, mode_paiement, statut)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [id_location, montant, mode_paiement, statut]
  );
  return result.rows[0];
}

export async function deletePaiement(id) {
  await pool.query("DELETE FROM paiement WHERE id_paiement=$1", [id]);
}
