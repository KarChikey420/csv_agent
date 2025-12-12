from ..data.load_data import load_dataframe

def get_correlation(file_path="app/agent/sample_employees.csv"):
    df=load_dataframe(file_path)
    
    corr=df.select_dtypes(include="number").corr()
    if corr.empty:
        return "No numeric columns found"
    
    return corr.to_string()

    