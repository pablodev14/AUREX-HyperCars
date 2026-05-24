import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import {
  accreditations,
  brand,
  dealers,
  financingPlans,
  models
} from "./data.js";

const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(express.json());
app.use(morgan("combined"));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin no permitido por CORS"));
    }
  })
);

const asCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(value);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "aurex-backend",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/brand", (_req, res) => {
  res.json(brand);
});

app.get("/api/models", (_req, res) => {
  res.json(
    models.map((model) => ({
      ...model,
      priceFormatted: asCurrency(model.priceCop),
      reservationFormatted: asCurrency(model.reservationCop)
    }))
  );
});

app.get("/api/models/:id", (req, res) => {
  const model = models.find((item) => item.id === req.params.id);

  if (!model) {
    res.status(404).json({ message: "Modelo no encontrado" });
    return;
  }

  res.json({
    ...model,
    priceFormatted: asCurrency(model.priceCop),
    reservationFormatted: asCurrency(model.reservationCop)
  });
});

app.get("/api/financing", (_req, res) => {
  res.json(financingPlans);
});

app.get("/api/accreditations", (_req, res) => {
  res.json(accreditations);
});

app.get("/api/dealers", (_req, res) => {
  res.json(dealers);
});

app.use((_req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.listen(port, () => {
  console.log(`AUREX API escuchando en http://localhost:${port}`);
});
