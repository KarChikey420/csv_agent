import pandas as pd

DATAFRAME=None
FILE_NAME=None
SUMMARY_CACHE=None

def load_data(df:pd.DataFrame,file_name:str=None):
    global DATAFRAME,FILE_NAME,SUMMARY_CACHE
    DATAFRAME=df
    FILE_NAME=file_name
    SUMMARY_CACHE=None
    
    if DATAFRAME is None:
        raise ValueError("No Dataset Uploaded yet")
    
    return DATAFRAME

        