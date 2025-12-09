from data.load_data import load_dataframe

def get_correlation():
    df=load_dataframe()
    
    corr=df.select_dtypes(include="number").corr()
    if corr.empty:
        return "No numeric columns found"
    
    return corr.to_string()

    