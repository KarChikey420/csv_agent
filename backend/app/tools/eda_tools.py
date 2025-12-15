from ..data.load_data import load_dataframe

def df_summary(file_path):
    df=load_dataframe(file_path)
    return df.describe(include="all").to_string()
 
def df_shape(file_path):
    df=load_dataframe(file_path)
    return f"Rows:{df.shape[0]},Columns:{df.shape[1]}"

def column_list(file_path):
    df=load_dataframe(file_path)
    return ", ".join(df.columns)
