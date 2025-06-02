#!/bin/bash
set -e

echo "🚀 Building shared package..."
cd shared
npm run build

cd ../backend
echo "🚀 Building backend..."
npm run build

cd ../frontend
echo "🚀 Building frontend..."
npm run build

echo "✅ Build completed successfully!"
