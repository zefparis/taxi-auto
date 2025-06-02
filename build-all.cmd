@echo off
echo Building shared package...
cd shared
call npm run build
cd ..

echo Building backend...
cd backend
call npm run build
cd ..

echo Building frontend...
cd frontend
call npm run build
cd ..

echo Build completed successfully!
