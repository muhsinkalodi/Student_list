#!/bin/bash

# Ramadan Data Collection Platform - Installation Script
# Copyright © 2026 qmexai

echo "🌙 Ramadan Data Collection Platform - Setup"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js detected: $(node --version)"
echo "✓ npm detected: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Create .env.local file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "⚙️  Creating .env.local file..."
    cp .env.example .env.local
    echo "✓ Created .env.local - Please configure your database connection"
else
    echo "✓ .env.local already exists"
fi

echo ""
echo "=============================================="
echo "✓ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your database credentials"
echo "2. Run: npm run dev"
echo "3. Open http://localhost:3000"
echo ""
echo "📚 Documentation: Check README.md for more details"
echo "🎨 Design Guide: Check DESIGN_GUIDE.md for styling information"
echo ""
echo "🌟 Happy coding with qmexai!"
echo "=============================================="
