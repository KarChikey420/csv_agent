import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import os
import uuid

def generate_plot(df, column, plot_type="hist"):
    
    plt.figure(figsize=(8,6))

    if plot_type == "hist":
        df[column].hist(bins=20)
        plt.title(f'Histogram of {column}')
    elif plot_type == "box":
        df.boxplot(column=column)
        plt.title(f'Box Plot of {column}')
    elif plot_type == "line":
        df[column].plot(kind="line")
        plt.title(f'Line Plot of {column}')
    else:
        return None 

    plt.xlabel(column)
    plt.ylabel('Frequency' if plot_type == 'hist' else 'Value')
    plt.tight_layout()
    
    # Save to buffer instead of file
    buffer = BytesIO()
    plt.savefig(buffer, format="png", bbox_inches='tight', dpi=150)
    plt.close()
    buffer.seek(0)
    
    # Encode to base64
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    print(f"Plot generated for {column} ({plot_type})")
    return f"![Plot](data:image/png;base64,{image_base64})"
