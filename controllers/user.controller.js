const db = require("../models")
const User = db.User
const Op = db.Sequelize.Op

exports.verifyUser = async (req, res) => {
  let errors = []
  !req.body.username ? errors.push({field: 'username', error: 'Not exists'}) : null
  !req.body.password ? errors.push({field: 'password', error: 'Not exists'}) : null
  if (errors.length > 0) {
    return res.status(400).send({
      errors
    })
  }
  let data = await User.findAll({
    where: {
      username: req.body.username,
      password: req.body.password
    }
  })
  if(data.length < 1) {
    errors.push({field: '', error: 'Verify data and try again'})
    return res.status(400).send({
      errors
    })
  }
  return res.json(data)
}

