import matplotlib.pyplot as plt
import base64
from io import BytesIO

def generate_plot(df, column, plot_type="hist"):
    
    plt.figure(figsize=(6,4))

    if plot_type == "hist":
        df[column].hist()
    elif plot_type == "box":
        df.boxplot(column=column)
    elif plot_type == "line":
        df[column].plot(kind="line")
    else:
        return None 

    buffer = BytesIO()
    plt.savefig(buffer, format="png")
    buffer.seek(0)
    plt.close()

    return base64.b64encode(buffer.read()).decode()
