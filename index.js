require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.HS_TOKEN;
const CRYPTID_OBJECT_ID = "2-31411719";

app.get("/", async (req, res) => {
  const customObjectsEndpoint = `https://api.hubspot.com/crm/v3/objects/${CRYPTID_OBJECT_ID}`;
  const properties = [
    "name",
    "first_sighting",
    "habitat",
    "size_string",
    "hs_object_id",
  ];

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    const resp = await axios.get(customObjectsEndpoint, {
      headers,
      params: { properties: properties.join(","), limit: 100 },
    });
    const data = resp.data.results;
    res.render("homepage", { title: "Cryptids | HubSpot APIs", data });
  } catch (error) {
    console.error(error);
  }
});

app.get("/update-cobj", async (req, res) => {
  res.render("update", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

app.post("/update-cobj", async (req, res) => {
  const update = {
    properties: {
      name: req.body.name,
      first_sighting: req.body.first_sighting,
      habitat: req.body.habitat,
      size_string: req.body.size_string,
    },
  };

  const updateCryptid = `https://api.hubapi.com/crm/v3/objects/${CRYPTID_OBJECT_ID}`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    await axios.post(updateCryptid, update, { headers });
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

// * Localhost
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
