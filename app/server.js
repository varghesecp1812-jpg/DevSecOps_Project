const express = require("express");
const path = require("path");
const sequelize = require("./config/database");

const Food = require("./models/Food");
const Order = require("./models/Order");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

// DB CONNECT
sequelize.sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch(err => console.log(err));

/* HOME PAGE */
app.get("/", async (req, res) => {
  const foods = await Food.findAll();
  res.render("index", { foods });
});

/* ADD FOOD */
app.post("/add-food", async (req, res) => {
  await Food.create({
    name: req.body.name,
    price: req.body.price
  });

  res.redirect("/");
});

/* ORDER FOOD (THIS FIXES YOUR ISSUE) */
app.post("/order/:id", async (req, res) => {
  try {
    await Order.create({
      foodId: req.params.id,
      quantity: 1,
      status: "Pending"
    });

    console.log("Order placed for food:", req.params.id);

    res.redirect("/");
  } catch (err) {
    console.log("Order error:", err);
    res.send("Order failed");
  }
});

/* START SERVER */
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
