const express = require('express')
const https = require("https")
const app = express()
const port = 3030
const cID = "4968762f41864bca9911e0b2c57b3854"
const cS = "9f27fefc68834d3e88806cd0cba2246d"




let author = {
    url: "https://accounts.spotify.com/api/token",
    headers:
        // 'Authorization':'Basic'+(new Buffer.from(cID+':'+cS).toString('base64')),
        'Content-Type=application/x-www-form-urlencoded'
    ,
    body: "grant_type=client_credentials&client_id=4968762f41864bca9911e0b2c57b3854&client_secret=9f27fefc68834d3e88806cd0cba2246d"
};


app.post(author, function (error, response, body) {
    var token = body.access_token
    console.log(`${token}`)
})

app.listen(port, () => console.log(`"app listening on ${port}L"`))

