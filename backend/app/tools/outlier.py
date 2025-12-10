def find_outlier(df):
    numeric=df.select_dtypes(include="number")
    outliers={}
    
    for col in numeric.columns:
        q1=df[col].quantile(0.25)
        q3=df[col].quantile(0.75)
        iqr=q3-q1
        
        lower=q1-1.5 * iqr
        upper=q3+1.5 * iqr
        
        outliers[col]=df[(df[col]<lower) | (df[col]>upper)].index.tolist()
        
    return outliers
