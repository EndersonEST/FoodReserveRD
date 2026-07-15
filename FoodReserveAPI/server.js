const express = require("express");
const cors = require("cors");

const restaurantRoutes = require("./routes/restaurants");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/restaurants", restaurantRoutes);

app.get("/", (req, res) => {
  res.send("FoodReserve API funcionando");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});