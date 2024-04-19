const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Your Spotify API credentials
const CLIENT_ID = '4968762f41864bca9911e0b2c57b3854';
const CLIENT_SECRET = '9f27fefc68834d3e88806cd0cba2246d';
const REDIRECT_URI = 'http://localhost:3000/callback';

// Endpoint to initiate the authentication flow
app.get('/login', (req, res) => {
  const scopes = 'user-read-private user-read-email'; // Add required scopes
  res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${REDIRECT_URI}`);
});

// Callback endpoint to handle authentication callback
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  // Exchange code for access token
  const authOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI
    })
  };

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
    const data = await response.json();
    const accessToken = data.access_token;

    // Use access token to make API requests
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const user = await userResponse.json();
    
    res.send(`Welcome, ${user.display_name}! Your email is ${user.email}`);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while authenticating.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
