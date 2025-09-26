const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Video games data
const games = [
  {
    id: 'zelda-totk',
    title: 'The Legend of Zelda: Tears of the Kingdom',
    genre: 'Action-Adventure',
    platform: 'Nintendo Switch',
    releaseYear: 2023,
    rating: 4.9,
    price: '$69.99',
    developer: 'Nintendo',
    description: 'An expansive adventure across a transformed Hyrule with new abilities and sky islands to explore.',
    image: 'https://assets-prd.ignimgs.com/2022/09/14/zelda-tears-of-the-kingdom-button-2k-1663127818777.jpg',
    multiplayer: false
  },
  {
    id: 'elden-ring',
    title: 'Elden Ring',
    genre: 'Action RPG',
    platform: 'PC, PS5/PS4, Xbox Series/One',
    releaseYear: 2022,
    rating: 4.8,
    price: '$59.99',
    developer: 'FromSoftware',
    description: 'Explore the Lands Between and forge your path in a breathtaking open world crafted with George R.R. Martin.',
    image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fassets-prd.ignimgs.com%2F2021%2F06%2F12%2Felden-ring-button-03-1623460560664.jpg&f=1&ipt=8eea22f2e7b0c04d66c00c3c75d405da4d6a3d11e9ae0391901e253beb472380',
    multiplayer: true
  },
  {
    id: 'spider-man-2',
    title: 'Marvel’s Spider-Man 2',
    genre: 'Action',
    platform: 'PS5',
    releaseYear: 2023,
    rating: 4.7,
    price: '$69.99',
    developer: 'Insomniac Games',
    description: 'Swing across New York as Peter and Miles with expanded traversal, combat, and a gripping narrative.',
    image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.gadgets360cdn.com%2Fproducts%2Flarge%2Fspider-man-2-poster-1543x2160-1686288382.jpg&f=1&ipt=30c74478186c36ef014c40ee3ff873c94dc901c7d6716a46d21510bfc84c1239',
    multiplayer: false
  },
  {
    id: 'baldurs-gate-3',
    title: 'Baldur’s Gate 3',
    genre: 'CRPG',
    platform: 'PC, PS5, Xbox Series',
    releaseYear: 2023,
    rating: 4.9,
    price: '$59.99',
    developer: 'Larian Studios',
    description: 'A deep, choice-driven RPG set in the Dungeons & Dragons universe with rich characters and systems.',
    image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimage.api.playstation.com%2Fvulcan%2Fap%2Frnd%2F202302%2F2321%2Fba706e54d68d10a0eb6ab7c36cdad9178c58b7fb7bb03d28.png&f=1&ipt=31f877b4b8ecaae84c431330a4249f07b30f22ff90e6c38f43437235d6ccfe1a',
    multiplayer: true
  },
  {
    id: 'mario-wonder',
    title: 'Super Mario Bros. Wonder',
    genre: 'Platformer',
    platform: 'Nintendo Switch',
    releaseYear: 2023,
    rating: 4.6,
    price: '$59.99',
    developer: 'Nintendo',
    description: 'Classic side-scrolling Mario with inventive Wonder effects that transform levels in surprising ways.',
    image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fassets-prd.ignimgs.com%2F2023%2F06%2F22%2F1x1-supermariobroswonder-1687454112497.jpg&f=1&ipt=5c6f9724ff6f9589f781c80d14fac118636246542a245983b52a8be946574521',
    multiplayer: true
  },
  {
    id: 'god-of-war-ragnarok',
    title: 'God of War Ragnarök',
    genre: 'Action-Adventure',
    platform: 'PS5/PS4',
    releaseYear: 2022,
    rating: 4.8,
    price: '$69.99',
    developer: 'Santa Monica Studio',
    description: 'Kratos and Atreus face the end times across the Nine Realms in a cinematic, combat-rich journey.',
    image: 'https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.png',
    multiplayer: false
  }
];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/games', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/games/:id', (req, res) => {
  const gameId = req.params.id;
  const game = games.find(g => g.id === gameId);
  
  if (!game) {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    return;
  }
  
  res.sendFile(path.join(__dirname, 'public', 'detail.html'));
});

// API route to get games data
app.get('/api/games', (req, res) => {
  res.json(games);
});

// API route to get specific game
app.get('/api/games/:id', (req, res) => {
  const gameId = req.params.id;
  const game = games.find(g => g.id === gameId);
  
  if (!game) {
    res.status(404).json({ error: 'Game not found' });
    return;
  }
  
  res.json(game);
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

