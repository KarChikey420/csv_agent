import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.tools.plot_tool import generate_plot
from app.data.load_data import load_dataframe

# Test plot generation
file_path = r"c:\Users\DELL\Desktop\prompt_agent\backend\temp_data\spotify_analysis_dataset.csv"
df = load_dataframe(file_path)

result = generate_plot(df, 'popularity', 'hist')
print("Plot result:", result)