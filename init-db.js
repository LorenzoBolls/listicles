const pool = require('./db-config');

// SQL to create the games table
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS games (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    platform VARCHAR(255) NOT NULL,
    release_year INTEGER NOT NULL,
    rating DECIMAL(2,1) NOT NULL,
    price VARCHAR(20) NOT NULL,
    developer VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    multiplayer BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// Sample games data
const gamesData = [
  {
    id: 'zelda-totk',
    title: 'The Legend of Zelda: Tears of the Kingdom',
    genre: 'Action-Adventure',
    platform: 'Nintendo Switch',
    release_year: 2023,
    rating: 4.9,
    price: '$69.99',
    developer: 'Nintendo',
    description: 'An expansive adventure across a transformed Hyrule with new abilities and sky islands to explore.',
    image_url: 'https://assets-prd.ignimgs.com/2022/09/14/zelda-tears-of-the-kingdom-button-2k-1663127818777.jpg',
    multiplayer: false
  },
  {
    id: 'elden-ring',
    title: 'Elden Ring',
    genre: 'Action RPG',
    platform: 'PC, PS5/PS4, Xbox Series/One',
    release_year: 2022,
    rating: 4.8,
    price: '$59.99',
    developer: 'FromSoftware',
    description: 'Explore the Lands Between and forge your path in a breathtaking open world crafted with George R.R. Martin.',
    image_url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fassets-prd.ignimgs.com%2F2021%2F06%2F12%2Felden-ring-button-03-1623460560664.jpg&f=1&ipt=8eea22f2e7b0c04d66c00c3c75d405da4d6a3d11e9ae0391901e253beb472380',
    multiplayer: true
  },
  {
    id: 'spider-man-2',
    title: 'Marvel\'s Spider-Man 2',
    genre: 'Action',
    platform: 'PS5',
    release_year: 2023,
    rating: 4.7,
    price: '$69.99',
    developer: 'Insomniac Games',
    description: 'Swing across New York as Peter and Miles with expanded traversal, combat, and a gripping narrative.',
    image_url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.gadgets360cdn.com%2Fproducts%2Flarge%2Fspider-man-2-poster-1543x2160-1686288382.jpg&f=1&ipt=30c74478186c36ef014c40ee3ff873c94dc901c7d6716a46d21510bfc84c1239',
    multiplayer: false
  },
  {
    id: 'baldurs-gate-3',
    title: 'Baldur\'s Gate 3',
    genre: 'CRPG',
    platform: 'PC, PS5, Xbox Series',
    release_year: 2023,
    rating: 4.9,
    price: '$59.99',
    developer: 'Larian Studios',
    description: 'A deep, choice-driven RPG set in the Dungeons & Dragons universe with rich characters and systems.',
    image_url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimage.api.playstation.com%2Fvulcan%2Fap%2Frnd%2F202302%2F2321%2Fba706e54d68d10a0eb6ab7c36cdad9178c58b7fb7bb03d28.png&f=1&ipt=31f877b4b8ecaae84c431330a4249f07b30f22ff90e6c38f43437235d6ccfe1a',
    multiplayer: true
  },
  {
    id: 'mario-wonder',
    title: 'Super Mario Bros. Wonder',
    genre: 'Platformer',
    platform: 'Nintendo Switch',
    release_year: 2023,
    rating: 4.6,
    price: '$59.99',
    developer: 'Nintendo',
    description: 'Classic side-scrolling Mario with inventive Wonder effects that transform levels in surprising ways.',
    image_url: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fassets-prd.ignimgs.com%2F2023%2F06%2F22%2F1x1-supermariobroswonder-1687454112497.jpg&f=1&ipt=5c6f9724ff6f9589f781c80d14fac118636246542a245983b52a8be946574521',
    multiplayer: true
  },
  {
    id: 'god-of-war-ragnarok',
    title: 'God of War Ragnarök',
    genre: 'Action-Adventure',
    platform: 'PS5/PS4',
    release_year: 2022,
    rating: 4.8,
    price: '$69.99',
    developer: 'Santa Monica Studio',
    description: 'Kratos and Atreus face the end times across the Nine Realms in a cinematic, combat-rich journey.',
    image_url: 'https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.png',
    multiplayer: false
  }
];

async function initializeDatabase() {
  try {
    console.log('Creating games table...');
    await pool.query(createTableSQL);
    console.log('Games table created successfully');

    // Check if data already exists
    const result = await pool.query('SELECT COUNT(*) FROM games');
    const count = parseInt(result.rows[0].count);

    if (count === 0) {
      console.log('Inserting sample games data...');
      
      for (const game of gamesData) {
        const insertSQL = `
          INSERT INTO games (id, title, genre, platform, release_year, rating, price, developer, description, image_url, multiplayer)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO NOTHING
        `;
        
        await pool.query(insertSQL, [
          game.id,
          game.title,
          game.genre,
          game.platform,
          game.release_year,
          game.rating,
          game.price,
          game.developer,
          game.description,
          game.image_url,
          game.multiplayer
        ]);
      }
      
      console.log('Sample games data inserted successfully');
    } else {
      console.log(`Database already contains ${count} games`);
    }

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase, gamesData };
