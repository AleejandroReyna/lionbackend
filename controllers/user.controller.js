const db = require("../models")
const User = db.User
const Op = db.Sequelize.Op
var jwt = require('jsonwebtoken')

exports.verifyUser = async (req, res) => {
  let errors = []
  !req.body.username ? errors.push({field: 'username', error: 'Not exists'}) : null
  !req.body.password ? errors.push({field: 'password', error: 'Not exists'}) : null
  if (errors.length > 0) {
    return res.status(400).send({
      errors
    })
  }
  let user = await User.findOne({
    where: {
      username: req.body.username
    }
  })
  if(!user || !user.correctPassword(req.body.password)) {
    errors.push({field: '', error: 'Verify data and try again'})
    return res.status(400).send({
      errors
    })
  }
  var token = jwt.sign({
    data: {username: user.username, id: user.id},
    exp: Math.floor(Date.now() / 1000) + (60 * 60)
  }, process.env.SECRET_KEY)
  return res.json({username: user.username, token})
}

exports.createUser = async (req, res) => {
  let { username, password} = req.body
  let errors = []
  !req.body.username ? errors.push({field: 'username', error: 'Field required!'}) : null
  !req.body.password ? errors.push({field: 'password', error: 'Field required!'}) : null
  if (errors.length > 0) {
    return res.status(400).send({
      errors
    })
  }
  try {
    const newUser = await User.create({ username, password })
    return res.json({ id: newUser.id, username: newUser.username, createdAt: newUser.createdAt })
  } catch(e) {
    console.log(e)
    e.errors.forEach(error => {
      errors.push({field: error.path, error: error.message})
    })
    return res.status(400).send({
      errors
    })
  }
}