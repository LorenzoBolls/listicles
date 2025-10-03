#!/bin/bash

echo "🎮 Setting up Listicle Games Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

echo "✅ Node.js and PostgreSQL are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create database
echo "🗄️ Creating database..."
createdb listicles_games 2>/dev/null || echo "Database may already exist"

# Initialize database with sample data
echo "📊 Initializing database with sample data..."
node init-db.js

echo "🎉 Setup complete!"
echo ""
echo "To start the application, run:"
echo "  npm start"
echo ""
echo "The application will be available at: http://localhost:3001"
