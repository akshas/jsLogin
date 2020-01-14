const express = require("express");
const bcrypt = require("bcrypt");


const app = express();
app.use(express.json());
const users = [];

// routes

app.get("/users", (req, res) => {
    res.json(users)
})

app.post("/users", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log(salt);
        console.log(hashedPassword);
        const user = {
            name: req.body.name,
            password: hashedPassword
        }
        users.push(user);
        res.status(201).send();

    } catch (e) {
        res.status(500).send()
    }
})
// получение данных из базы, поэтому асинхронная функция
app.post("/users/login", async (req, res) => {
    // находим юзера в массиве с помощью find()
    const user = users.find(user => user.name == req.body.name)
    if (user == null) {
        // если его нет отправляем статус 400
        return res.status(400).send('Cannot find user');
    }
    // потом проверяем введенный пароль с помощью bcrypt.compare("введенный пароль", "пароль из базы")
    try {
        // bcrypt после await. Нужно ждать пока сравняться пароли из базы и введенны, и только потом res.send ...
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send("Success");
        } else {
            res.send("Not allowed")
        }
    } catch (e) {
        res.status(500).send()
    }
})


// init server connection
function init() {
    try {
        app.listen(3000, () => {
            console.log("server works");
        })
    } catch (error) {
        console.log(error);
    }
}


init();