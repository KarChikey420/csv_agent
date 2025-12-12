from ..data.load_data import load_dataframe

def find_missing(file_path):
    df=load_dataframe(file_path)
    
    missing=df.isna().sum()
    total_missing=missing.sum()
    
    if total_missing == 0:
        return "NO missing values found"
    
    result="Missing  values per column:\n"
    result += missing .to_string() 
    return result
