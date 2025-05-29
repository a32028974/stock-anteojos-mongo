const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// ✅ MongoDB Atlas URI (ya conectado a tu base)
const MONGO_URI = "mongodb+srv://juan:juan6980@cluster0.5pzpxts.mongodb.net/opticacristal?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("🟢 Conectado a MongoDB");
  })
  .catch((err) => {
    console.error("🔴 Error conectando a MongoDB:", err);
  });

app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // 🧾 Sirve el index.html

// 📦 Esquema de productos
const productoSchema = new mongoose.Schema({}, { strict: false });
const Producto = mongoose.model("Producto", productoSchema);

// 🔎 Buscar producto por anteojo o código de barras
app.get("/api/productos", async (req, res) => {
  const { anteojo, codigo } = req.query;
  let filtro = {};

  if (anteojo) filtro["N ANTEOJO"] = parseInt(anteojo);
  if (codigo) filtro["CODIGO DE BARRAS"] = parseInt(codigo);

  try {
    const producto = await Producto.findOne(filtro);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(producto);
  } catch (err) {
    console.error("🔴 Error en la búsqueda:", err.message);
    res.status(500).json({ error: "Error en la búsqueda", detalle: err.message });
  }
});

// 🔍 Endpoint de prueba para ver productos
app.get("/api/todo", async (req, res) => {
  try {
    const docs = await Producto.find({}).limit(3);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
