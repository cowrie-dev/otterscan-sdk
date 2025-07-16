#!/bin/bash

# Exit on any error
set -e

echo "🚀 Publishing Otterscan SDK..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the SDK directory?"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running linter..."
npm run lint

# Run type checking
echo "🔍 Running type check..."
npm run type-check

# Run tests
echo "🧪 Running tests..."
npm run test

# Build the project
echo "🏗️  Building project..."
npm run build

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found after build"
    exit 1
fi

# Publish to npm
echo "📮 Publishing to npm..."
npm publish

echo "✅ Successfully published Otterscan SDK!"
echo "🎉 You can now install it with: npm install otterscan-sdk"