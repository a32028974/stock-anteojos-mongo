// 🔁 Marcar como vendido con observaciones
app.post("/api/vender", async (req, res) => {
  const { id, vendedor, observaciones } = req.body;

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
          OBSERVACIONES: observaciones || ""
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

// ❌ Anular venta
app.post("/api/anular-venta", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Falta el N° de anteojo" });
  }

  try {
    const producto = await Producto.findOneAndUpdate(
      { "N ANTEOJO": parseInt(id) },
      {
        $unset: {
          FECHA_DE_VENTA: "",
          VENDEDOR: "",
          OBSERVACIONES: ""
        },
      },
      { new: true }
    );

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ mensaje: "Venta anulada", producto });
  } catch (err) {
    console.error("❌ Error anulando venta:", err.message);
    res.status(500).json({ error: "Error anulando venta", detalle: err.message });
  }
});
