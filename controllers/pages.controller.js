const db = require("../models")
const fetch = require('node-fetch')
const FavoriteBreed = db.FavoriteBreed

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

exports.setFavorite = async (req, res) => {
  let errors = []
  !req.body.breed ? errors.push({field: 'breed', error: 'The field is required!'}) : null
  if (errors.length > 0) {
    return res.status(400).send({
      errors
    })
  }
  let params = {breed: req.body.breed, userId: req.user.data.id, parent: null}
  if(req.body.parent) {
    params['parent'] = req.body.parent
  }
  //upsert doesn't work for me
  try {
    let request = await FavoriteBreed.findOne({userId: params.userId})
    if (request) {
      console.log(request.id)
      let updateRequest = await FavoriteBreed.update(params, {
        where: {
          id: request.id
        }
      })
      return res.json({id: request.id, status: "changed"})
    } else {
      let createRequest = await FavoriteBreed.create(params)
      return res.json({id: createRequest.id, status: "created"})
    }
  }catch(e) {
    errors.push({field: "", error: `${e}`})
    return res.status(500).send({ errors })
  }
}