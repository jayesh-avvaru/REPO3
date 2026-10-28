const express = require("express");

const app = express();
app.use(express.json());

// ---------- In-memory "database" ----------
const db = new Map();
let nextId = 1;

const notFound = (res) => res.status(404).json({ detail: "Item not found" });

// ---------- CREATE ----------
app.post("/items", (req, res) => {
  const { name, description = null, price } = req.body || {};
  if (name === undefined || price === undefined) {
    return res.status(400).json({ detail: "name and price are required" });
  }
  const item = { id: nextId++, name, description, price };
  db.set(item.id, item);
  res.status(201).json(item);
});

// ---------- READ ----------
app.get("/items", (req, res) => {
  res.json([...db.values()]);
});

app.get("/items/:id", (req, res) => {
  const item = db.get(Number(req.params.id));
  item ? res.json(item) : notFound(res);
});

// ---------- UPDATE ----------
app.put("/items/:id", (req, res) => {
  const item = db.get(Number(req.params.id));
  if (!item) return notFound(res);

  const { name, description, price } = req.body || {};
  if (name !== undefined) item.name = name;
  if (description !== undefined) item.description = description;
  if (price !== undefined) item.price = price;
  res.json(item);
});

// ---------- DELETE ----------
app.delete("/items/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!db.has(id)) return notFound(res);
  db.delete(id);
  res.status(204).send();
});

app.listen(8000, () => console.log("Server running on http://127.0.0.1:8000"));

// Run:  npm init -y && npm install express
//       node server.js
