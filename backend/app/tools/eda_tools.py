from data.load_data import load_dataframe

def df_summary():
    df=load_dataframe()
    return df.describe(include="all").to_string()
 
def df_shape():
    df=load_dataframe()
    return f"Rows:{df.shape[0]},Columns:{df.shape[1]}"

def column_list():
    df=load_dataframe()
    return ", ".join(df.columns)
