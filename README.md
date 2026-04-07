# DataFlow AI - Premium EDA Intelligence Platform

DataFlow is a sophisticated, high-performance multi-agent platform designed for automated **Exploratory Data Analysis (EDA)**, interactive data reasoning, and state-of-the-art visual insights. It leverages **LangGraph-driven agents** to provide specialized reasoning, collaborative problem-solving, and deep contextual data understanding.

---

## ✨ Features

### 💎 Premium Modern UI/UX
- **Interactive Split-Screen Auth**: A beautiful, high-tech authentication interface featuring immersive background animations and a responsive mobile-first layout.
- **Glassmorphic Command Center**: A sleek 7/5 split-screen dashboard that separates intensive data exploration from the AI-powered query engine.
- **Electric Indigo Theme**: A cohesive, professional dark-mode aesthetic consistent across the entire platform.

### 🧠 Intelligent EDA Engine
- **Expert Cluster (Multi-Agent System)**: Orchestrated via **LangGraph**, specialized agents collaborate to solve complex data challenges, from statistical profiling to outlier detection.
- **EDA Reasoning (ReAct Agent)**: Performs multi-step logical reasoning to deliver structured insights, correlations, and anomalies without manual querying.
- **Smart Schema Retrieval**: Implements RAG (Retrieval-Augmented Generation) for deep contextual interaction with dataset metadata and historical analysis.

### 📊 Powerful Visualization
- **Instant Plot Generation**: On-the-fly creation of histograms, box plots, and heatmaps delivered as embedded images to ensure privacy and eliminate storage latency.
- **Interactive Data Workspace**: Real-time CSV preview with sticky headers, feature-level metadata, and statistical distribution summaries.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19 (Vite), Tailwind CSS v4, Lucide Icons, React Markdown |
| **Backend** | FastAPI, LangGraph, LangChain, PostgreSQL (NeonDB) |
| **Processing** | Pandas, Matplotlib, NumPy |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 📂 Project Structure

```text
├── backend/
│   ├── app/
│   │   ├── agent/       # LangGraph multi-agent & ReAct logic
│   │   ├── config/      # System settings, CORS, and environment configs
│   │   ├── data/        # Data loading & CSV parsing utilities
│   │   ├── dbsetup/     # PostgreSQL/NeonDB & JWT Authentication logic
│   │   ├── tools/       # Specialized EDA tools (Visualizations, Statistics)
│   │   └── main.py      # FastAPI entry point & API Router
│   ├── requirements.txt # Backend dependencies
│   └── render.yaml      # Render infrastructure configuration
├── frontend/
│   ├── components/      # UI components (AuthForm, DataDashboard, etc.)
│   ├── services/        # API communication layer (Axios)
│   ├── App.tsx          # Main application orchestrator
│   └── index.css        # Tailwind global theme & glassmorphic utilities
└── sample.csv           # Ready-to-use testing dataset
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **PostgreSQL** (or NeonDB instance)

### Local Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/KarChikey420/csv_agent.git
   cd csv_agent
   ```

2. **Backend Configuration**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   
   # Create .env with the following keys:
   # DATABASE_URL=postgresql://...
   # OPENAI_API_KEY=...
   # SECRET_KEY=...
   
   uvicorn app.main:app --reload
   ```

3. **Frontend Configuration**:
   ```bash
   cd frontend
   npm install
   
   # Update .env.local:
   # VITE_API_BASE_URL=http://localhost:8000
   
   npm run dev
   ```

---

## 🌐 Production Deployment

- **Frontend**: Seamlessly deployed on **Vercel** with automatic production builds.
- **Backend**: Hosted on **Render** using a native environment managed via `render.yaml`.
- **CORS Support**: Configured to handle dynamic origins across `*.onrender.com` and `*.vercel.app`.

---

## 📝 License & Contact
© 2026 DataFlow AI Systems. Built for Advanced Data Intelligence.
For support or collaboration, visit [KarChikey-Portfolio](https://github.com/KarChikey420).
