import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg') # Use non-interactive backend for thread safety
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
from typing import Dict, List, Any, Optional
import functools

# Performance constants
MAX_PLOT_POINTS = 10000

def get_summary_stats(df: pd.DataFrame) -> Dict[str, Any]:
    """Return comprehensive summary statistics for the dataframe."""
    stats = {
        "row_count": len(df),
        "column_count": len(df.columns),
        "missing_values": df.isnull().sum().to_dict(),
        "data_types": df.dtypes.astype(str).to_dict(),
        "summary": df.describe(include='all').replace({np.nan: None}).to_dict()
    }
    return stats

def detect_outliers(df: pd.DataFrame, columns: Optional[List[str]] = None) -> Dict[str, Any]:
    """Detect outliers using high-performance vectorized operations."""
    if columns is None:
        columns = df.select_dtypes(include=[np.number]).columns.tolist()
    
    results = {}
    for col in columns:
        col_data = df[col].dropna()
        if col_data.empty:
            continue
            
        # IQR Method (Vectorized)
        q1, q3 = col_data.quantile([0.25, 0.75])
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        
        iqr_mask = (col_data < lower_bound) | (col_data > upper_bound)
        iqr_outlier_count = iqr_mask.sum()
        
        # Z-Score Method (Vectorized)
        mean = col_data.mean()
        std = col_data.std()
        if std > 0:
            z_scores = np.abs((col_data - mean) / std)
            z_outlier_count = (z_scores > 3).sum()
        else:
            z_outlier_count = 0
            
        results[col] = {
            "iqr_bounds": (float(lower_bound), float(upper_bound)),
            "iqr_outlier_count": int(iqr_outlier_count),
            "z_outlier_count": int(z_outlier_count),
            "sample_outliers": col_data[iqr_mask].head(10).tolist()
        }
    return results

def get_correlation_matrix(df: pd.DataFrame) -> Dict[str, Any]:
    """Compute correlation matrix for numeric columns."""
    numeric_df = df.select_dtypes(include=[np.number])
    if numeric_df.empty:
        return {"error": "No numeric columns for correlation"}
    
    corr = numeric_df.corr().replace({np.nan: None}).to_dict()
    return corr

def generate_eda_plot(df: pd.DataFrame, plot_type: str, x: str, y: Optional[str] = None, hue: Optional[str] = None, title: Optional[str] = None) -> str:
    """Generate a plot with dynamic runtime downsampling for speed."""
    # Ensure no leftover figures from previous threads
    plt.close('all')
    
    # Dynamic Downsampling for Sub-Second Rendering
    plot_df = df
    is_sampled = False
    if len(df) > MAX_PLOT_POINTS:
        plot_df = df.sample(n=MAX_PLOT_POINTS, random_state=42)
        is_sampled = True
        if title:
            title += " (Sampled)"
        else:
            title = "Sampled Distribution"

    plt.figure(figsize=(10, 6))
    sns.set_style("whitegrid")
    
    try:
        if plot_type == "histogram":
            sns.histplot(data=plot_df, x=x, hue=hue, kde=True)
        elif plot_type == "box":
            sns.boxplot(data=plot_df, x=x, y=y, hue=hue)
        elif plot_type == "scatter":
            sns.scatterplot(data=plot_df, x=x, y=y, hue=hue)
        elif plot_type == "bar":
            sns.barplot(data=plot_df, x=x, y=y, hue=hue)
        elif plot_type == "heatmap":
            corr = plot_df.select_dtypes(include=[np.number]).corr()
            sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")
        else:
            plt.text(0.5, 0.5, f"Unsupported plot type: {plot_type}", ha='center', va='center')
        
        if title:
            plt.title(title)
        
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight', dpi=80)
        plt.close('all')
        buf.seek(0)
        img_str = base64.b64encode(buf.read()).decode('utf-8')
        return f"data:image/png;base64,{img_str}"
    except Exception as e:
        plt.close('all')
        return f"Error generating plot: {str(e)}"

def get_advanced_correlations(df: pd.DataFrame) -> str:
    """Generate a clustered heatmap for complex correlation patterns."""
    plt.close('all')
    numeric_df = df.select_dtypes(include=[np.number])
    if numeric_df.empty:
        return "Error: No numeric data available for correlation analysis."
    
    # Pre-calculated correlation to reduce plot overhead
    corr = numeric_df.corr()
    
    plt.figure(figsize=(12, 10))
    sns.clustermap(corr, annot=True, cmap='vlag', center=0, fmt=".2f", linewidths=.75)
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', dpi=80)
    plt.close('all')
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    return f"data:image/png;base64,{img_str}"

def get_time_series_projection(df: pd.DataFrame, target_col: str, periods: int = 10) -> Dict[str, Any]:
    """Perform a simple trend projection using linear regression on row index or date."""
    if target_col not in df.columns:
        return {"error": f"Column '{target_col}' not found."}
    
    data = df[target_col].dropna()
    if len(data) < 2:
        return {"error": "Not enough data points for projection."}
    
    # Use index as time proxy
    x = np.arange(len(data))
    y = data.values
    
    # Linear Fit: y = mx + c
    slope, intercept = np.polyfit(x, y, 1)
    
    # Project future steps
    future_x = np.arange(len(data), len(data) + periods)
    future_y = slope * future_x + intercept
    
    # Prepare plot
    plt.close('all')
    plt.figure(figsize=(10, 5))
    plt.plot(x, y, label='Historical', color='blue', alpha=0.6)
    plt.plot(future_x, future_y, label='Projected Trend', color='red', linestyle='--')
    plt.fill_between(future_x, future_y * 0.9, future_y * 1.1, color='red', alpha=0.1, label='Confidence Interval (est.)')
    plt.title(f"Trend Projection for {target_col}")
    plt.legend()
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', dpi=80)
    plt.close('all')
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    
    return {
        "slope": float(slope),
        "projection_plot": f"data:image/png;base64,{img_str}",
        "final_predicted_value": float(future_y[-1])
    }

def get_predictive_insights(df: pd.DataFrame, target: str, feature: str) -> Dict[str, Any]:
    """Analyze the predictive relationship between two variables."""
    if target not in df.columns or feature not in df.columns:
         return {"error": "Target or Feature column not found."}
    
    temp_df = df[[target, feature]].dropna()
    if len(temp_df) < 5:
        return {"error": "Insufficient data for predictive modeling."}
    
    x = temp_df[feature].values
    y = temp_df[target].values
    
    # Regression
    slope, intercept = np.polyfit(x, y, 1)
    
    # Correlation Coefficient (Pearson)
    r = np.corrcoef(x, y)[0, 1]
    r_squared = r**2
    
    insight = "strong" if r_squared > 0.7 else "moderate" if r_squared > 0.4 else "weak"
    
    return {
        "r_squared": float(r_squared),
        "relationship_strength": insight,
        "impact_factor": float(slope),
        "description": f"For every unit increase in {feature}, {target} usually changes by {slope:.2f} units."
    }
