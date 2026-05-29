const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const User = require("./models/User");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

sequelize.sync();

app.get("/", async (req, res) => {
    const users = await User.findAll();
    res.render("index", { users });
});

app.post("/add", async (req, res) => {
    const { name, email } = req.body;

    await User.create({
        name,
        email
    });

    res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
    await User.destroy({
        where: {
            id: req.params.id
        }
    });

    res.redirect("/");
});

app.get("/edit/:id", async (req, res) => {
    const user = await User.findByPk(req.params.id);

    res.render("edit", { user });
});

app.post("/update/:id", async (req, res) => {
    const { name, email } = req.body;

    await User.update(
        { name, email },
        {
            where: {
                id: req.params.id
            }
        }
    );

    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
