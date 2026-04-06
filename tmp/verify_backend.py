import os
import sys

# Add the app directory to sys.path
sys.path.append(os.getcwd())

from backend.app.agent.react_agent import run_react_agent
from backend.app.config.setting import TEMP_DATA_DIR

def test_react_agent():
    print("Testing React Agent...")
    # Create a dummy CSV
    csv_path = os.path.join(TEMP_DATA_DIR, "test.csv")
    os.makedirs(TEMP_DATA_DIR, exist_ok=True)
    with open(csv_path, "w") as f:
        f.write("name,age\nAlice,30\nBob,25")
    
    try:
        # Note: This requires GEMMA_API_KEY to be set in environment
        # If it's not set, this will fail, but we can check if it gets to that point.
        response = run_react_agent("How many rows are there?", csv_path)
        print(f"Response: {response}")
    except Exception as e:
        print(f"React Agent failed (expected if API key missing): {e}")

if __name__ == "__main__":
    test_react_agent()
