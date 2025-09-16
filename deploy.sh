#!/bin/bash

# Deployment script for International Kabab House
# This script automates the deployment process

set -e  # Exit on any error

echo "🍽️  International Kabab House - Deployment Script"
echo "=================================================="

# Check if environment file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and configure your environment variables."
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required tools
echo "📋 Checking prerequisites..."
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building the application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ] || [ ! -d "server/public" ]; then
    echo "❌ Build failed! Please check the error messages above."
    exit 1
fi

echo "✅ Build completed successfully"

# Database setup (if needed)
echo "🗄️  Setting up database..."
if command_exists psql; then
    npm run db:push
    echo "✅ Database schema updated"
else
    echo "⚠️  PostgreSQL client not found. Please ensure your database is set up correctly."
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "To start the application:"
echo "  npm start"
echo ""
echo "The application will be available at http://localhost:5000"
echo ""

# Optional: Start the application
read -p "Do you want to start the application now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting the application..."
    npm start
fi