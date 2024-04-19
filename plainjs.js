let token = "NULL";
let arijit_id = "4YRxDV8wJFPHPTeXepOstw";

function getToken() {
    let call = fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials&client_id=4968762f41864bca9911e0b2c57b3854&client_secret=9f27fefc68834d3e88806cd0cba2246d"
    })
    return call
}

async function onLoad() {//laklsklkalslaksllakslaklaslaksla
    try {
        let postApiCall = await getToken();
        const data = await postApiCall.json()
        return data
    }
    catch (err) {
        console.log("err: ", err)
    }
}

async function start() {
    console.log("token before: ", token)
    const promise = onLoad()

    promise.then((data) => {
        console.log("Success: dedededed", data);
        token = data["access_token"];
        console.log("token after: ", token)
    })
    return promise
}

async function getTrackdata(trackId) {

    let str = { "Authorization": "Bearer " + token }
    try {
        // console.log(str)
        let url = "https://api.spotify.com/v1/tracks/" + trackId;
        const response = await fetch(url, {
            method: "GET",
            headers: str
            // Authorization: "Bearer " + token
        })
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        return data
    }
    catch (error) {
        console.error(`Could not get data: ${error}`);
    }

}

async function getProfile() {


    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });

    const data = await response.json();
    return data
}


let trackID = "7zn5ecZSwGsLTi1wgxyVzd"
const process1 = start()
process1.then(() => {
    console.log(".................................................................................................")
    const p2 = getTrackdata(trackID)

    p2.then((data) => {
        console.log(data['artists'][0]['name'])
        console.log(data['artists'][1]['name'])
        console.log(data['artists'][2]['name'])
    })

})




