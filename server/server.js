const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken
  console.log('hi')

  const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:3000',
    clientId: '1feee3008cdd43e1ae8c77b9fc525d8a',
    clientSecret: 'b8ed07abb13f45bbab8ba8ee705f2a91',
    refreshToken,
  })
  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      })
    })
    .catch(() => {
      res.sendStatus(400)
    })
})

app.post('/login', (req, res) => {
  const code = req.body.code

  const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:3000',
    clientId: '1feee3008cdd43e1ae8c77b9fc525d8a',
    clientSecret: 'b8ed07abb13f45bbab8ba8ee705f2a91',
  })
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      })
    })
    .catch(() => {
      res.sendStatus(400)
    })
})

app.listen(3001)
