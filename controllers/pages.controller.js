const fetch = require('node-fetch')

exports.getData = async (req, res) => {
  let errors = []
  try {
    let request = await fetch("https://dog.ceo/api/breeds/list/all", {method: 'get'})
    if (request.status === 200) {
      let _response = []
      let response = await request.json()
      let _data = {...response.message}
      for (const p in _data) {
        let newBreed = {name: p}
        if(_data[p].length > 0) {
          newBreed.subBreeds = []
          _data[p].map(sub => newBreed.subBreeds.push({name: sub}))
        }
        _response.push(newBreed)
      }
      return res.json(_response)
    }
    return res.status(request.status).send({ errors })
  } catch(e) {
    errors.push({field: "", error: `${e}`})
    return res.status(500).send({ errors })
  }
}