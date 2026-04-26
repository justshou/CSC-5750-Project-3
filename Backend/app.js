// Backend: application services, accessible by URIs

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const dbService = require("./dbService");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));

// read
app.get("/getAll", (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllData(); // call a DB function

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

app.get("/getAvailableSlots", (request, response) => {
  const db = dbService.getDbServiceInstance();

  db.getAvailableSlots()
    .then((data) => response.json({ data: data }))
    .catch((err) => response.json({ success: false, message: err.message }));
});

app.post("/registerStudent", (request, response) => {
  const db = dbService.getDbServiceInstance();

  db.registerStudent(request.body)
    .then((data) => response.json(data))
    .catch((err) => response.json({ success: false, message: err.message }));
});

const path = require("path");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// if we configure here directly
app.listen(5050, () => {
  console.log("I am listening on the port 5050.");
});
