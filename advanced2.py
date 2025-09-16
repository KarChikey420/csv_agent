import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from io import BytesIO
from csv_agent import create_agent, load_agent  # Your LangChain agent functions


st.set_page_config(page_title="Advanced EDA & Visualization", layout="wide")
st.title("Advanced EDA & Visualization App")


st.sidebar.title("Navigation")
page = st.sidebar.radio("Go to", ["EDA", "Visualization"])

if "df" not in st.session_state:
    st.session_state.df = None

uploaded_file = st.sidebar.file_uploader("Upload CSV", type=["csv"])
if uploaded_file:
    try:
        df = pd.read_csv(uploaded_file)
        st.session_state.df = df
        
        llm = load_agent()
        if llm:
            st.session_state.agent = create_agent(df, llm)
        st.sidebar.success("File uploaded successfully!")
    except Exception as e:
        st.sidebar.error(f"Error loading CSV: {e}")

if st.session_state.df is not None:
    df = st.session_state.df

    numerical_cols = df.select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    datetime_cols = df.select_dtypes(include=['datetime64', 'datetime']).columns.tolist()


    st.sidebar.markdown("---")
    st.sidebar.subheader("📊 Dataset Info")
    st.sidebar.write(f"**Numerical**: {', '.join(numerical_cols) if numerical_cols else 'None'}")
    st.sidebar.write(f"**Categorical**: {', '.join(categorical_cols) if categorical_cols else 'None'}")
    st.sidebar.write(f"**Datetime**: {', '.join(datetime_cols) if datetime_cols else 'None'}")

    if "agent" not in st.session_state:
        llm = load_agent()
        if llm:
            st.session_state.agent = create_agent(df, llm)
    agent = st.session_state.agent

    if page == "EDA":
        st.subheader("Exploratory Data Analysis (EDA)")
        st.write("Data Preview:")
        st.dataframe(df.head(), use_container_width=True)

        # Basic statistics
        st.write("Basic Statistics:")
        st.dataframe(df.describe(include='all'), use_container_width=True)

        # Missing values
        st.write("Missing Values:")
        missing = df.isnull().sum()
        if missing.sum() == 0:
            st.write("No missing values found.")
        else:
            st.dataframe(missing[missing > 0], use_container_width=True)

        # Custom LangChain question
        if agent:
            question = st.text_input("Ask a question about your data (e.g., 'What is the average salary?')")
            if st.button("Run EDA Question"):
                if not question:
                    st.warning("Please enter a question.")
                else:
                    with st.spinner("Generating answer..."):
                        try:
                            response = agent.invoke({"input": question})
                            st.text_area("Answer", value=str(response["output"]), height=400)
                        except Exception as e:
                            st.error(f"Error: {e}")
        else:
            st.warning("Agent not available. Check API key configuration.")

    
    elif page == "Visualization":
        st.subheader("Data Visualization")
        plot_options = ["Histogram", "Boxplot", "Violin Plot", "Correlation Heatmap", "Pairplot"]
        if datetime_cols and numerical_cols:
            plot_options.append("Time Series")
        task = st.selectbox("Select plot type", plot_options)

        columns_selected = None
        if task in ["Histogram", "Boxplot", "Violin Plot"]:
            if numerical_cols:
                columns_selected = st.selectbox("Select numerical column", numerical_cols)
            else:
                st.warning("No numerical columns available for this plot.")
        if task == "Pairplot":
            if numerical_cols:
                columns_selected = st.multiselect("Select multiple numerical columns", numerical_cols)
            else:
                st.warning("No numerical columns available for pairplot.")
        if task == "Time Series":
            if datetime_cols and numerical_cols:
                time_col = st.selectbox("Select datetime column", datetime_cols)
                value_col = st.selectbox("Select numerical column", numerical_cols)
                columns_selected = (time_col, value_col)
            else:
                st.warning("Datetime and numerical columns required for time series.")

        # Plot title
        default_title = f"{task} of {columns_selected if isinstance(columns_selected, str) else 'selected columns'}"
        plot_title = st.text_input("Plot title", value=default_title)

        if st.button("Generate Plot"):
            if not columns_selected:
                st.warning("Please select at least one column to generate the plot.")
            else:
                with st.spinner("Creating plot..."):
                    try:
                        if task == "Histogram":
                            fig, ax = plt.subplots()
                            sns.histplot(df[columns_selected], kde=True, ax=ax)
                            ax.set_title(plot_title)
                            ax.set_xlabel(columns_selected)
                            ax.set_ylabel("Count")
                            st.pyplot(fig)
                            # Download plot
                            buf = BytesIO()
                            fig.savefig(buf, format="png", bbox_inches="tight")
                            st.download_button("Download Plot", buf.getvalue(), f"{task.lower()}.png", "image/png")
                            plt.close(fig)

                        elif task == "Boxplot":
                            fig, ax = plt.subplots()
                            sns.boxplot(y=df[columns_selected], ax=ax)
                            ax.set_title(plot_title)
                            ax.set_ylabel(columns_selected)
                            st.pyplot(fig)
                            # Download plot
                            buf = BytesIO()
                            fig.savefig(buf, format="png", bbox_inches="tight")
                            st.download_button("Download Plot", buf.getvalue(), f"{task.lower()}.png", "image/png")
                            plt.close(fig)

                        elif task == "Violin Plot":
                            fig, ax = plt.subplots()
                            sns.violinplot(y=df[columns_selected], ax=ax)
                            ax.set_title(plot_title)
                            ax.set_ylabel(columns_selected)
                            st.pyplot(fig)
                            # Download plot
                            buf = BytesIO()
                            fig.savefig(buf, format="png", bbox_inches="tight")
                            st.download_button("Download Plot", buf.getvalue(), f"{task.lower()}.png", "image/png")
                            plt.close(fig)

                        elif task == "Correlation Heatmap":
                            if numerical_cols:
                                fig, ax = plt.subplots(figsize=(10, 8))
                                sns.heatmap(df[numerical_cols].corr(), annot=True, cmap="coolwarm", ax=ax)
                                ax.set_title(plot_title)
                                st.pyplot(fig)
                                # Download plot
                                buf = BytesIO()
                                fig.savefig(buf, format="png", bbox_inches="tight")
                                st.download_button("Download Plot", buf.getvalue(), f"{task.lower()}.png", "image/png")
                                plt.close(fig)
                            else:
                                st.warning("No numerical columns for correlation heatmap.")
                                st.stop()

                        elif task == "Pairplot":
                            if len(columns_selected) > 0:
                                pair_grid = sns.pairplot(df[columns_selected])
                                pair_grid.figure.suptitle(plot_title, y=1.02)
                                st.pyplot(pair_grid.figure)
                                # Download plot
                                buf = BytesIO()
                                pair_grid.figure.savefig(buf, format="png", bbox_inches="tight")
                                st.download_button("Download Plot", buf.getvalue(), f"{task.lower()}.png", "image/png")
                                plt.close(pair_grid.figure)  # Close the underlying figure
                            else:
                                st.warning("Select at least one column for pairplot.")
                                st.stop()

                        elif task == "Time Series":
                            time_col, value_col = columns_selected
                            fig, ax = plt.subplots()
                            df.plot(x=time_col, y=value_col, ax=ax)
                            ax.set_title(plot_title)
                            ax.set_xlabel(time_col)
                            ax.set_ylabel(value_col)
                            st.pyplot(fig)
                            # Download plot
                            buf = BytesIO()
                            fig.savefig(buf, format="png", bbox_inches="tight")
                            st.download_button("Download Plot", buf.getvalue(), f"{task.lower()}.png", "image/png")
                            plt.close(fig)

                    except Exception as e:
                        st.error(f"Error: {e}")
                        # Ensure figure is closed in case of error
                        if task == "Pairplot" and 'pair_grid' in locals():
                            plt.close(pair_grid.figure)
                        elif 'fig' in locals():
                            plt.close(fig)

else:
    st.info("Please upload a CSV file using the sidebar to start.")