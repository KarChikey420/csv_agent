# EDA Agent Platform - Setup Guide

## Quick Start

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd eda_agent
npm install
npm run dev
```

### 3. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## Configuration

### Backend (.env in backend folder)
```
Gemini_Api=your_google_gemini_api_key
```

### Database
- Uses SQLite (app.db) - automatically created on first run
- No external database setup required

## API Quota Issue

If you see "429 quota exceeded" errors:
- Free tier: 5 requests/minute for Gemini API
- Wait 60 seconds between requests
- Or upgrade your Google AI API plan

## Features
- ✅ Authentication (signup/login)
- ✅ ReAct Agent for EDA
- ✅ Multi-Agent collaboration
- ✅ Memory-based chat
- ✅ File upload support (CSV/Excel/JSON)
