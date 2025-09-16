# Advanced EDA & Visualization App

This application provides advanced Exploratory Data Analysis (EDA) and visualization capabilities using AI agents.

## Features

### 🤖 AI-Powered Agents
- **EDA Agent**: Handles data analysis questions and insights
- **Visualization Agent**: Specialized AI agent for creating beautiful, publication-ready plots

### 📊 Visualization Modes
1. **Quick Plots**: Traditional matplotlib/seaborn plots
2. **AI-Generated Plots**: Beautiful plots created by the visualization agent
3. **Custom Visualization**: Describe what you want, and the AI creates it
4. **Get Suggestions**: AI-powered recommendations for the best visualizations

### 🔧 Technical Features
- Streamlit-based web interface
- LangChain integration with Google Gemini
- Pandas DataFrame agents for data manipulation
- Publication-quality visualizations

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Setup**:
   Create a `.env` file with your Google API key:
   ```
   Gemini_Api=your_google_api_key_here
   ```

3. **Run the Application**:
   ```bash
   streamlit run advanced.py
   ```

## Usage

1. **Upload Data**: Use the sidebar to upload a CSV file
2. **EDA Page**: Ask questions about your data using natural language
3. **Visualization Page**: Choose from multiple visualization modes:
   - Quick Plots for standard visualizations
   - AI-Generated Plots for enhanced, publication-ready charts
   - Custom Visualization for personalized plots based on descriptions
   - Get Suggestions for AI-recommended visualizations

## Agent Architecture

### EDA Agent (`csv_agent.py`)
- Handles general data analysis questions
- Provides insights about data quality, correlations, and patterns
- Uses Google Gemini model for natural language processing

### Visualization Agent (`visualization_agent.py`)
- Specialized for creating visualizations
- Optimized prompts for plot generation
- Handles edge cases and ensures publication-quality output
- Provides multiple visualization methods:
  - `create_histogram()`: Distribution analysis
  - `create_boxplot()`: Outlier detection and quartile analysis
  - `create_violin_plot()`: Distribution shape comparison
  - `create_correlation_heatmap()`: Correlation analysis
  - `create_pairplot()`: Multivariate analysis
  - `create_custom_plot()`: Custom visualizations from descriptions
  - `suggest_visualizations()`: AI-powered recommendations

## Benefits of Agent-Based Architecture

1. **Separation of Concerns**: EDA and visualization are handled by specialized agents
2. **Better Performance**: Each agent is optimized for its specific task
3. **Enhanced Quality**: Visualization agent produces publication-ready plots
4. **Flexibility**: Easy to extend with additional specialized agents
5. **User Experience**: Multiple visualization modes cater to different user needs

## Example Usage

### EDA Questions
- "Give me a summary of this dataset"
- "What are the most correlated columns?"
- "Check for missing values and data quality issues"

### Custom Visualization Examples
- "Create a scatter plot showing the relationship between age and salary, colored by department"
- "Show the distribution of sales by month with trend lines"
- "Create a heatmap of customer satisfaction scores by region and product category"