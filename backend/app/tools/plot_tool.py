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
    
    # Create plots directory in backend folder
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    plots_dir = os.path.join(backend_dir, "temp_data", "plots")
    os.makedirs(plots_dir, exist_ok=True)
    
    plot_filename = f"plot_{uuid.uuid4().hex[:8]}.png"
    plot_path = os.path.join(plots_dir, plot_filename)
    
    # Save the plot
    plt.savefig(plot_path, format="png", bbox_inches='tight', dpi=150)
    plt.close()
    
    print(f"Plot saved to: {plot_path}")
    return f"![Plot](/api/plots/{plot_filename})"
