import express from "express";
import { 
  listerUtilisateurs,
  lireUtilisateur,
  creerUtilisateur,
  modifierUtilisateur,
  supprimerUtilisateur,
  connexionUtilisateur
} from "../controllers/utilisateurController.js";

const router = express.Router();

router.get("/", listerUtilisateurs);
router.get("/:id", lireUtilisateur);
router.post("/", creerUtilisateur);
router.post("/login", connexionUtilisateur); // ✅ route login
router.put("/:id", modifierUtilisateur);
router.delete("/:id", supprimerUtilisateur);

export default router;
