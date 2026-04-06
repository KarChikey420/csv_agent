import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
from typing import Dict, List, Any, Optional

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
    """Detect outliers using IQR and Z-Score methods."""
    if columns is None:
        columns = df.select_dtypes(include=[np.number]).columns.tolist()
    
    results = {}
    for col in columns:
        # IQR Method
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        iqr_outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)][col].tolist()
        
        # Z-Score Method
        mean = df[col].mean()
        std = df[col].std()
        if std > 0:
            z_scores = (df[col] - mean) / std
            z_outliers = df[np.abs(z_scores) > 3][col].tolist()
        else:
            z_outliers = []
            
        results[col] = {
            "iqr_bounds": (lower_bound, upper_bound),
            "iqr_outlier_count": len(iqr_outliers),
            "z_outlier_count": len(z_outliers),
            "sample_outliers": iqr_outliers[:10]
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
    """Generate a plot and return as Base64 string."""
    plt.figure(figsize=(10, 6))
    sns.set_style("whitegrid")
    
    try:
        if plot_type == "histogram":
            sns.histplot(data=df, x=x, hue=hue, kde=True)
        elif plot_type == "box":
            sns.boxplot(data=df, x=x, y=y, hue=hue)
        elif plot_type == "scatter":
            sns.scatterplot(data=df, x=x, y=y, hue=hue)
        elif plot_type == "bar":
            sns.barplot(data=df, x=x, y=y, hue=hue)
        elif plot_type == "heatmap":
            corr = df.select_dtypes(include=[np.number]).corr()
            sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")
        else:
            plt.text(0.5, 0.5, f"Unsupported plot type: {plot_type}", ha='center', va='center')
        
        if title:
            plt.title(title)
        
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight')
        plt.close()
        buf.seek(0)
        img_str = base64.b64encode(buf.read()).decode('utf-8')
        return f"data:image/png;base64,{img_str}"
    except Exception as e:
        plt.close()
        return f"Error generating plot: {str(e)}"
