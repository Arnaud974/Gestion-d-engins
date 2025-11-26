import express from "express";
import {
  listerPaiements,
  creerPaiement,
  supprimerPaiement,
} from "../controllers/paiementController.js";

const router = express.Router();

router.get("/", listerPaiements);
router.post("/", creerPaiement);
router.delete("/:id", supprimerPaiement);

export default router;
