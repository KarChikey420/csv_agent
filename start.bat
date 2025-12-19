@echo off
echo Starting EDA Agent Platform...

echo Installing backend dependencies...
cd backend
pip install -r requirements.txt
if not exist requirements.txt (
    echo Creating requirements.txt...
    echo fastapi==0.104.1 > requirements.txt
    echo uvicorn==0.24.0 >> requirements.txt
    echo sqlalchemy==2.0.23 >> requirements.txt
    echo bcrypt==4.1.2 >> requirements.txt
    echo python-jose==3.3.0 >> requirements.txt
    echo python-multipart==0.0.6 >> requirements.txt
    echo langchain==0.1.0 >> requirements.txt
    echo langchain-google-genai==0.0.6 >> requirements.txt
    echo pandas==2.1.4 >> requirements.txt
    echo python-dotenv==1.0.0 >> requirements.txt
    pip install -r requirements.txt
)

echo Starting backend server...
start cmd /k "cd /d %cd% && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

cd ..
echo Installing frontend dependencies...
cd eda_agent
call npm install

echo Starting frontend development server...
start cmd /k "cd /d %cd% && npm run dev"

echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
pause