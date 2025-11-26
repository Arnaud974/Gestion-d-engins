import express from "express";
import cors from "cors";

import utilisateurRoutes from "./routes/utilisateurRoutes.js";
import enginRoutes from "./routes/enginRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import paiementRoutes from "./routes/paiementRoutes.js";
import soldeRoutes from "./routes/soldeRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/utilisateurs", utilisateurRoutes);
app.use("/api/engins", enginRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/paiements", paiementRoutes);
app.use("/api/solde", soldeRoutes);

export default app;
