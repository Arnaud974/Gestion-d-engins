import pool from "../config/db.js";

export async function getSolde() {
  const result = await pool.query("SELECT * FROM solde LIMIT 1");
  return result.rows[0];
}

export async function updateSolde(montant) {
  await pool.query("UPDATE solde SET soldeactuel = soldeactuel + $1", [montant]);
}
