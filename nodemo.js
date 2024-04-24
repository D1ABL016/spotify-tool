const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

const playid = "7xLKWb79xRjzZGbSxhpO5c";
let token = ""
const CLIENT_ID = '4968762f41864bca9911e0b2c57b3854';
const CLIENT_SECRET = '9f27fefc68834d3e88806cd0cba2246d';
const REDIRECT_URI = 'http://localhost:3000/callback';


async function getToken() {

    try {
        const url = 'https://accounts.spotify.com/api/token'
        const Auth = {
            method: 'POST',
            body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
            },
            json: true
        };
        const response = await fetch(url, Auth);
        const data = await response.json();
        const accessToken = data.access_token;
        return accessToken
    } catch (error) {
        console.log(error)
    }



}

async function getAuthHeader(token) {
    let ans = { "Authorization": "Bearer " + token }
    return ans
}

async function getArtistid(artist_name) {
    let AuthHeader = await getAuthHeader(token)
    const url = `https://api.spotify.com/v1/search?q=${artist_name}&type=artist&limit=1&offset=0&market=IN`


    const response = await fetch(url, {
        method: "GET",
        headers: AuthHeader
    })
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json()
    const id = data.artists.items[0].id
    // console.log("data id => ",data['artists'])
    // console.log("data id => ",data['artists']['items'][0]['id'] )
    return id
}

function getPlaylistId(l1) {
    let ans = l1.replace('https://open.spotify.com/playlist/', '')
    return ans
}

app.get('/callback', async function (req, res) {
    try {
        token = await getToken()
        let AuthHeader = await getAuthHeader(token)
        // let Artist_id = 
        let Artist_id = await getArtistid(ArtistName)
        let PlayistID = getPlaylistId(userLink)
        // console.log("playlist id ",PlayistID)



        let url = "https://api.spotify.com/v1/playlists/" + PlayistID
        const response = await fetch(url, {
            method: "GET",
            headers: AuthHeader
        })

        if (!response.ok) {
            res.send("enter a valid link")
        }

        const data = await response.json();
        console.log("..................................................................................................")

        let arr = data.tracks.items
        if (data.public) {
            let ans = []
            console.log(arr.length)
            console.log("..................................................................................................")


            for (let i = 0; i < arr.length; i++) {

                let a = data.tracks.items[i].track.artists
                for (let j = 0; j < a.length; j++) {
                    if (a[j].id == Artist_id) {
                        console.log(data.tracks.items[i].track.name)
                        ans.push(data.tracks.items[i].track.name)
                        break;
                    }
                }
            }
            console.log(ans)
            res.send(ans)
        }
    }
    catch (err) {
        // res.status(err).send("is error")
        console.log("Error ", err)
    }
})


app.get('/server', async function (req, res) {
    userLink = req.query['spotify_link'];
    ArtistName = req.query['Artist'];

    res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`);

})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
