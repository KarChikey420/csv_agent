import requests
import os

url = "http://127.0.0.1:8000/data/preview"
file_path = "backend/app/temp_data/test.csv"

if not os.path.exists(file_path):
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "w") as f:
        f.write("name,age\nAlice,30\nBob,25")

with open(file_path, "rb") as f:
    files = {"file": ("test.csv", f, "text/csv")}
    try:
        response = requests.post(url, files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Request failed: {e}")
