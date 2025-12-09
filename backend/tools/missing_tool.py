from data.load_data import load_dataframe

def find_missing():
    df=load_dataframe()
    
    missing=df.isna().sum()
    total_missing=missing.sum()
    
    if total_missing == 0:
        return "NO missing values found"
    
    result="Missing  values per column:\n"
    result += missing .to_string() 
    return result
