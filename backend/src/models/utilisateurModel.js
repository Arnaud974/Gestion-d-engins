import pool from "../config/db.js";

// 📋 Lister tous les utilisateurs
export async function getAllUtilisateurs() {
  const result = await pool.query("SELECT * FROM utilisateur ORDER BY id_utilisateur");
  return result.rows;
}

// 📖 Récupérer un utilisateur par ID
export async function getUtilisateurById(id) {
  const result = await pool.query("SELECT * FROM utilisateur WHERE id_utilisateur=$1", [id]);
  return result.rows[0];
}

// ➕ Créer un utilisateur
export async function createUtilisateur(data) {
  const { nom, prenom, email, mot_de_passe, telephone, adresse, role } = data;
  const result = await pool.query(
    `INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, telephone, adresse, role)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [nom, prenom, email, mot_de_passe, telephone, adresse, role]
  );
  return result.rows[0];
}

// ✏️ Mettre à jour un utilisateur
export async function updateUtilisateur(id, data) {
  const { nom, prenom, email, telephone, adresse, role, statut_compte } = data;
  const result = await pool.query(
    `UPDATE utilisateur SET nom=$1, prenom=$2, email=$3, telephone=$4, adresse=$5, role=$6, statut_compte=$7
     WHERE id_utilisateur=$8 RETURNING *`,
    [nom, prenom, email, telephone, adresse, role, statut_compte, id]
  );
  return result.rows[0];
}

// ❌ Supprimer un utilisateur
export async function deleteUtilisateur(id) {
  await pool.query("DELETE FROM utilisateur WHERE id_utilisateur=$1", [id]);
}

// 🔐 Connexion utilisateur
export async function loginUtilisateur(email, mot_de_passe) {
  // Vérifie si l’utilisateur existe
  const result = await pool.query("SELECT * FROM utilisateur WHERE email = $1", [email]);
  if (result.rows.length === 0) {
    return { success: false, message: "Email introuvable ❌" };
  }

  const user = result.rows[0];

  // Vérifie le mot de passe (non chiffré)
  if (mot_de_passe !== user.mot_de_passe) {
    return { success: false, message: "Mot de passe incorrect ❌" };
  }

  return { success: true, user };
}
