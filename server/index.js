const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
const PORT = 5000;

app.use(express.json());

// CORS setup if you want to access this from frontend on a different port
const cors = require('cors');
app.use(cors());

app.get('/api/matches', async (req, res) => {
  try {
    // Fetch upcoming matches (next 10 matches) from Premier League (competitionId: 2021)
    const response = await axios.get('https://api.football-data.org/v4/competitions/PL/matches', {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY }
    });

    // Extract matches data
    const matches = response.data.matches.slice(0, 10).map(match => ({
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      dateTime: match.utcDate // ISO 8601 format with date and time in UTC
    }));

    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error.message);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});