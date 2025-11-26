import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Fade,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({
    clients: 0,
    engins: 0,
    locations: 0,
    paiements: 0,
  });
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  const API_URLs = "${API_URL}/api";

  // 🎯 Récupération des données du backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, enginsRes, locRes, payRes] = await Promise.all([
          axios.get(`${API_URL}/api/utilisateurs`),
          axios.get(`${API_URL}/api/engins`),
          axios.get(`${API_URL}/api/locations`),
          axios.get(`${API_URL}/api/paiements`),
        ]);

        const clients =
          usersRes.data.data?.filter((u) => u.role === "client").length ||
          usersRes.data.length ||
          0;

        const engins = enginsRes.data.data?.length || enginsRes.data.length || 0;
        const locations = locRes.data.data?.length || locRes.data.length || 0;
        const paiements = payRes.data.data?.length || payRes.data.length || 0;

        setStats({ clients, engins, locations, paiements });

        // 📊 Générer les données de graphe
        const grouped = locRes.data.data?.reduce((acc, loc) => {
          const month = new Date(loc.date_debut).toLocaleString("fr-FR", {
            month: "short",
          });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        const formatted = Object.entries(grouped || {}).map(([mois, total]) => ({
          mois,
          total,
        }));

        setGraphData(formatted);
      } catch (err) {
        console.error("Erreur dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 15 }}>
        <CircularProgress size={70} thickness={4} color="primary" />
      </Box>
    );

  // 🟩 Cartes de statistiques
  const cards = [
    { label: "Clients", value: stats.clients, color: "#0288d1" },
    { label: "Engins", value: stats.engins, color: "#43a047" },
    { label: "Locations", value: stats.locations, color: "#f9a825" },
    { label: "Paiements", value: stats.paiements, color: "#e53935" },
  ];

  return (
    <Fade in timeout={700}>
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#1e293b" }}
        >
          Tableau de bord
        </Typography>

        {/* Cartes statistiques */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {cards.map((c, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 250 }}
              >
                <Paper
                  elevation={6}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    background: c.color,
                    color: "white",
                    borderRadius: 4,
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
                  }}
                >
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    {c.label}
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {c.value}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Graphiques */}
        <Grid container spacing={4}>
          {/* Graphique des locations mensuelles */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 4,
                background: "#f9fafb",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Évolution des locations (par mois)
              </Typography>
              {graphData.length === 0 ? (
                <Typography color="text.secondary">
                  Pas encore de données disponibles.
                </Typography>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#0288d1"
                      strokeWidth={3}
                      dot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Paper>
          </Grid>

          {/* Graphique barres : comparatif des entités */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 4,
                background: "#f9fafb",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Répartition des données principales
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cards}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#43a047" barSize={60} radius={6} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
}

export default Dashboard;
