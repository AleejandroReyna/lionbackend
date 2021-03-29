const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require('./models')
const users = require('./controllers/user.controller')
const pages = require('./controllers/pages.controller')
require('dotenv').config()

const app = express()
db.sequelize.sync();

var corsOptions = {
  origin: "http://localhost:3000"
}

app.use(cors(corsOptions))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))


app.get("/", (req, res) => {
  res.json({ message: "index." })
})

app.post("/login/", users.verifyUser)
app.get("/data/", pages.getData)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
