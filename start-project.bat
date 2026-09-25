@echo off
cd /d "%~dp0"
if exist backend\target\cargoshare-backend-1.0.0.jar (
  start "CargoShare Backend" cmd /k "cd backend && java -jar target/cargoshare-backend-1.0.0.jar"
) else (
  start "CargoShare Backend" cmd /k "cd backend && mvn spring-boot:run"
)
start "CargoShare Frontend" cmd /k "npm run dev"
start "" http://localhost:5173
