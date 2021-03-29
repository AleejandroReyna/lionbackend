const fetch = require('node-fetch')

exports.getData = async (req, res) => {
  let errors = []
  try {
    let request = await fetch("https://dog.ceo/api/breeds/list/all", {method: 'get'})
    if (request.status === 200) {
      let response = await request.json()
      return res.json(response)
    }
    return res.status(request.status).send({ errors })
  } catch(e) {
    errors.push({field: "", error: `${e}`})
    return res.status(500).send({ errors })
  }
}