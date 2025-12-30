# DataFlow - AI-Powered EDA Intelligence Agent

DataFlow is a sophisticated multi-agent platform designed for automated Exploratory Data Analysis (EDA) and intelligent data interaction. It leverages Large Language Models (LLMs) and LangChain to provide reasoning-based insights, collaborative multi-agent problem solving, and RAG-based knowledge retrieval.

## 🚀 Key Features

- **Expert Cluster (Multi-Agent System)**: A collaborative environment where multiple specialized agents work together to solve complex data problems.
- **EDA Reasoning Engine (ReAct Agent)**: A powerful engine that performs multi-step reasoning to analyze datasets, detect outliers, calculate correlations, and provide structured insights.
- **Schema & Knowledge Store**: Implements Retrieval-Augmented Generation (RAG) to allow users to interact with stored schemas and historical data context.
- **Instant Data Preview**: Real-time CSV file preview upon upload, including column metadata and basic statistics.
- **Dynamic Visualization**: On-the-fly plot generation (histograms, box plots, etc.) delivered as embedded Base64 images to ensure privacy and eliminate local file storage.
- **Modern UI/UX**: A premium, dark-mode dashboard built with React and Tailwind CSS, featuring glassmorphism and responsive design.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS / Vanilla CSS
- **Icons**: Lucide React
- **Markdown Rendering**: React Markdown
- **API Client**: Axios

### Backend
- **Framework**: FastAPI
- **AI Orchestration**: LangChain
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Security**: JWT Authentication & bcrypt password hashing
- **Data Processing**: Pandas / Matplotlib

## 📦 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL Database

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd prompt_agent
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Configure environment variables (.env)
   # Run the server
   uvicorn app.main:app --reload
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📂 Project Structure

```text
├── backend/
│   ├── app/
│   │   ├── agent/       # LangChain agent implementations
│   │   ├── config/      # System configurations
│   │   ├── data/        # Data loading utilities
│   │   ├── dbsetup/     # Database and Auth logic
│   │   ├── llm_loder/   # LLM initialization
│   │   ├── tools/       # Specialized EDA tools (plotting, reports, etc.)
│   │   └── main.py      # FastAPI entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page views
│   │   ├── services/    # API communication layer
│   │   └── App.tsx      # Main application entry
└── temp_data/           # Temporary storage for uploaded CSVs
```

## 📝 License

© 2025 DataFlow EDA Agent. Built for Advanced Data Intelligence.
