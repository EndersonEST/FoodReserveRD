const express = require("express");
const axios = require("axios");

const router = express.Router();

const API_KEY = "e8d7c508b433488e97ad599488f56611";

router.get("/", async (req, res) => {

    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({
            error: "Faltan coordenadas"
        });
    }

    try {

        const url =
            `https://api.geoapify.com/v2/places?categories=catering.restaurant,catering.fast_food,catering.cafe,catering.pizza&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=50&apiKey=${API_KEY}`;

        const response = await axios.get(
`https://api.geoapify.com/v2/places?categories=catering.restaurant,catering.fast_food,catering.cafe&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=30&apiKey=e8d7c508b433488e97ad599488f56611`
);

const restaurants = response.data.features.map(place => ({

    id: place.properties.place_id,

    nombre:
        place.properties.name || "Restaurante",

    categoria:
        place.properties.categories?.[0] || "Restaurante",

    direccion:
        place.properties.formatted || "Dirección no disponible",

    telefono:
        place.properties.phone || "",

    website:
        place.properties.website || "",

    ciudad:
        place.properties.city || "",

    lat:
        place.properties.lat,

    lon:
        place.properties.lon

}));

        res.json(restaurants);

    } catch (err) {

        console.log(err.response?.data || err.message);

        res.status(500).json({
            error: "Error consultando Geoapify"
        });

    }

});

module.exports = router;