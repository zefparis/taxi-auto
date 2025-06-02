#!/bin/bash

# Exit on error
set -e

echo "Building shared package..."
cd shared
npm run build
cd ..

echo "Building backend..."
cd backend
npm run build
cd ..

echo "Building frontend..."
cd frontend
npm run build
cd ..

echo "Build completed successfully!"
