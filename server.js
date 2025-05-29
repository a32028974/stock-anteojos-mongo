const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔌 Conexión a MongoDB Atlas
const MONGO_URI = "mongodb+srv://juan:juan6980@cluster0.5pzpxts.mongodb.net/opticacristal?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI)
  .then(() => console.log("🟢 Conectado a MongoDB"))
  .catch((err) => console.error("🔴 Error conectando a MongoDB:", err));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Sirve HTML, CSS, JS

// 📦 Esquema de Producto (flexible)
const productoSchema = new mongoose.Schema({}, { strict: false });
const Producto = mongoose.model("Producto", productoSchema);

// 🔍 Búsqueda por N° Anteojo o Código de Barras
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

// 🔎 Búsqueda avanzada por marca o modelo (parcial, insensible a mayúsculas)
app.get("/api/busqueda-avanzada", async (req, res) => {
  const { marca, modelo } = req.query;
  let filtro = {};

  if (marca) filtro["MARCA"] = { $regex: marca, $options: "i" };
  if (modelo) filtro["MODELO"] = { $regex: modelo, $options: "i" };

  try {
    const resultados = await Producto.find(filtro).limit(10);
    res.json(resultados);
  } catch (err) {
    console.error("❌ Error en búsqueda avanzada:", err.message);
    res.status(500).json({ error: "Error en búsqueda avanzada", detalle: err.message });
  }
});

// 📦 Marcar producto como vendido con vendedor
app.post("/api/vender", async (req, res) => {
  const { id, vendedor } = req.body;

  if (!id || !vendedor) {
    return res.status(400).json({ error: "Faltan datos: id y vendedor son requeridos" });
  }

  try {
    const producto = await Producto.findOneAndUpdate(
      { "N ANTEOJO": parseInt(id) },
      {
        $set: {
          FECHA_DE_VENTA: new Date().toISOString(),
          VENDEDOR: vendedor,
        },
      },
      { new: true }
    );

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ mensaje: "Producto marcado como vendido", producto });
  } catch (err) {
    console.error("❌ Error marcando como vendido:", err.message);
    res.status(500).json({ error: "Error actualizando producto", detalle: err.message });
  }
});

// 🧪 Ruta de prueba para ver algunos productos
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
