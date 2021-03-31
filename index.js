const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require('./models')
const users = require('./controllers/user.controller')
const pages = require('./controllers/pages.controller')
var jwt = require('express-jwt');
require('dotenv').config()

const app = express()
db.sequelize.sync();

var corsOptions = {
  origin: "http://localhost:3000"
}

app.use(cors(corsOptions))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(jwt({ secret: process.env.SECRET_KEY, algorithms: ['HS256']}).unless({path: ['/','/login/', '/signup/']}));


app.get("/", (req, res) => {
  res.json({ message: "index." })
})

app.post("/login/", users.verifyUser)
app.post("/signup/", users.createUser)
app.get("/data/", pages.getData)
app.post("/set_favorite/", pages.setFavorite)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
