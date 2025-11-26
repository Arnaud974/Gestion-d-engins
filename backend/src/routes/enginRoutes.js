import express from "express";
import {
  listerEngins,
  lireEngin,
  creerEngin,
  modifierEngin,
  supprimerEngin,
} from "../controllers/enginController.js";

const router = express.Router();

router.get("/", listerEngins);
router.get("/:matricule", lireEngin);
router.post("/", creerEngin);
router.put("/:matricule", modifierEngin);
router.delete("/:matricule", supprimerEngin);

export default router;
