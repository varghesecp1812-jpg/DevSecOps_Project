const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const User = require("./models");

const app = express();

app.use(cors());
app.use(express.json());

// Connect DB
sequelize.sync({ alter: true })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });

/* -------------------- CREATE USER -------------------- */
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------------------- GET USERS -------------------- */
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------------------- UPDATE USER -------------------- */
app.put("/users/:id", async (req, res) => {
  try {
    await User.update(req.body, {
      where: { id: req.params.id },
    });
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------------------- DELETE USER -------------------- */
app.delete("/users/:id", async (req, res) => {
  try {
    await User.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
