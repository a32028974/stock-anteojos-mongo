const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ MongoDB Atlas URI
const MONGO_URI = "mongodb+srv://juan:juan6980@cluster0.5pzpxts.mongodb.net/opticacristal?retryWrites=true&w=majority";

// 🔌 Conexión a MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("🟢 Conectado a MongoDB"))
  .catch((err) => console.error("🔴 Error conectando a MongoDB:", err));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Sirve archivos HTML, CSS, etc.

// 🧾 Esquema flexible (permite todos los campos)
const productoSchema = new mongoose.Schema({}, { strict: false });
const Producto = mongoose.model("Producto", productoSchema);

// 🔍 Búsqueda POST (usada por el HTML)
app.post("/api/buscar", async (req, res) => {
  const { id, codigo } = req.body;
  let filtro = {};

  if (id) filtro["N ANTEOJO"] = parseInt(id);
  if (codigo) filtro["CODIGO DE BARRAS"] = parseInt(codigo);

  try {
    const resultados = await Producto.find(filtro).limit(5);
    res.json(resultados);
  } catch (err) {
    console.error("❌ Error buscando producto:", err.message);
    res.status(500).json({ error: "Error en la búsqueda", detalle: err.message });
  }
});

// 🔎 Ruta de prueba para ver productos
app.get("/api/todo", async (req, res) => {
  try {
    const docs = await Producto.find({}).limit(3);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
