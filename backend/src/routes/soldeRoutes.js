import express from "express";
import { lireSolde, incrementerSolde } from "../controllers/soldeController.js";

const router = express.Router();

router.get("/", lireSolde);
router.put("/", incrementerSolde);

export default router;
