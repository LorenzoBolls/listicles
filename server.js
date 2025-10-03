const express = require('express');
const path = require('path');
const pool = require('./db-config');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/games', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/games/:id', async (req, res) => {
  try {
    const gameId = req.params.id;
    const result = await pool.query('SELECT * FROM games WHERE id = $1', [gameId]);
    
    if (result.rows.length === 0) {
      res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
      return;
    }
    
    res.sendFile(path.join(__dirname, 'public', 'detail.html'));
  } catch (error) {
    console.error('Error checking game:', error);
    res.status(500).sendFile(path.join(__dirname, 'public', '404.html'));
  }
});

// API route to get games data
app.get('/api/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games ORDER BY rating DESC, title ASC');
    const games = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      genre: row.genre,
      platform: row.platform,
      releaseYear: row.release_year,
      rating: parseFloat(row.rating),
      price: row.price,
      developer: row.developer,
      description: row.description,
      image: row.image_url,
      multiplayer: row.multiplayer
    }));
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API route to search games by specific attributes
app.get('/api/games/search', async (req, res) => {
  try {
    const { q, genre, platform, developer, minRating, maxRating, multiplayer } = req.query;
    
    let query = 'SELECT * FROM games WHERE 1=1';
    const params = [];
    let paramCount = 0;
    
    // Search by title or description (q parameter)
    if (q) {
      paramCount++;
      query += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${q}%`);
    }
    
    // Filter by genre
    if (genre) {
      paramCount++;
      query += ` AND genre ILIKE $${paramCount}`;
      params.push(`%${genre}%`);
    }
    
    // Filter by platform
    if (platform) {
      paramCount++;
      query += ` AND platform ILIKE $${paramCount}`;
      params.push(`%${platform}%`);
    }
    
    // Filter by developer
    if (developer) {
      paramCount++;
      query += ` AND developer ILIKE $${paramCount}`;
      params.push(`%${developer}%`);
    }
    
    // Filter by minimum rating
    if (minRating) {
      paramCount++;
      query += ` AND rating >= $${paramCount}`;
      params.push(parseFloat(minRating));
    }
    
    // Filter by maximum rating
    if (maxRating) {
      paramCount++;
      query += ` AND rating <= $${paramCount}`;
      params.push(parseFloat(maxRating));
    }
    
    // Filter by multiplayer
    if (multiplayer !== undefined) {
      paramCount++;
      query += ` AND multiplayer = $${paramCount}`;
      params.push(multiplayer === 'true');
    }
    
    query += ' ORDER BY rating DESC, title ASC';
    
    const result = await pool.query(query, params);
    const games = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      genre: row.genre,
      platform: row.platform,
      releaseYear: row.release_year,
      rating: parseFloat(row.rating),
      price: row.price,
      developer: row.developer,
      description: row.description,
      image: row.image_url,
      multiplayer: row.multiplayer
    }));
    
    res.json(games);
  } catch (error) {
    console.error('Error searching games:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API route to get specific game
app.get('/api/games/:id', async (req, res) => {
  try {
    const gameId = req.params.id;
    const result = await pool.query('SELECT * FROM games WHERE id = $1', [gameId]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }
    
    const row = result.rows[0];
    const game = {
      id: row.id,
      title: row.title,
      genre: row.genre,
      platform: row.platform,
      releaseYear: row.release_year,
      rating: parseFloat(row.rating),
      price: row.price,
      developer: row.developer,
      description: row.description,
      image: row.image_url,
      multiplayer: row.multiplayer
    };
    
    res.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

