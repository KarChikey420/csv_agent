import pandas as pd

def load_dataframe(file_name):
    if isinstance(file_name, pd.DataFrame):
        return file_name
    df=pd.read_csv(file_name)
    return df

        