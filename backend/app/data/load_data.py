import pandas as pd

def load_dataframe(file_name):
    if isinstance(file_name, pd.DataFrame):
        return file_name
    if file_name is None:
        raise ValueError("No file provided. Please upload a CSV file.")
    if file_name.endswith('.csv'):
        df = pd.read_csv(file_name)
    elif file_name.endswith(('.xls', '.xlsx')):
        df = pd.read_excel(file_name)
    elif file_name.endswith('.json'):
        df = pd.read_json(file_name)
    else:
        # Fallback to CSV or raise error
        try:
            df = pd.read_csv(file_name)
        except:
             raise ValueError("Unsupported file format. Please upload CSV, Excel, or JSON.")
    return df

        