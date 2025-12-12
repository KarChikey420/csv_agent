import pandas as pd

def load_dataframe(file_name:str=None):
    df=pd.read_csv(file_name)
    return df
        