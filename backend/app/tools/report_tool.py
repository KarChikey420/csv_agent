from .missing_tool import find_missing
from .correlation import get_correlation
from .outlier import find_outlier
from .eda_tools import df_summary,df_shape ,column_list

def generate_report(df):
    """
    Returns complete structured EDA report.
    """
    return {
        "shape": df_shape(df),
        "columns": column_list(df),
        "summary_statistics": df_summary(df),
        "missing_values": find_missing(df),
        "correlations": get_correlation(df),
        "outliers": find_outlier(df),
    }
