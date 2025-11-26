import express from "express";
import {
  listerLocations,
  creerLocation,
  modifierLocation,
  supprimerLocation,
} from "../controllers/locationController.js";

const router = express.Router();

// GET → liste des locations
router.get("/", listerLocations);

// POST → créer une nouvelle location
router.post("/", creerLocation);

// PUT → modifier une location
router.put("/:id", modifierLocation);

// DELETE → supprimer une location
router.delete("/:id", supprimerLocation);

export default router;
