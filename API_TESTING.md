# API Testing Guide using Postman

This guide explains how to test the Agent API endpoints.

## 1. Chat & React Agent (File Upload Support)
**Endpoint:** `POST http://localhost:8000/chat` or `POST http://localhost:8000/agent/react`

These endpoints require **Multipart/Form-Data** because they support file uploads.

**Postman Setup:**
1.  Create a new Request.
2.  Set Method to **POST**.
3.  Set URL to `http://localhost:8000/chat`.
4.  Go to the **Body** tab.
5.  Select **form-data**.
6.  Add the following Key-Value pairs:
    *   **Key**: `query` | **Value**: `Analyze this dataset` (Type: Text)
    *   **Key**: `file` | **Value**: [Select a CSV file] (Type: File)
        *   *Note: To change type to File, hover over the Key field in Postman and use the dropdown.*

## 2. Multi-Agent (EDA Tools)
**Endpoint:** `POST http://localhost:8000/agent/multi`

Same setup as above.

**Postman Setup:**
1.  **Method**: POST
2.  **Body**: form-data
3.  **Key**: `query` | **Value**: `Find missing values`
4.  **Key**: `file` | **Value**: [Select CSV file]

## 3. Memory Agent (Chat History)
**Endpoint:** `POST http://localhost:8000/agent/memory`

This endpoint expects a JSON body.

**Postman Setup:**
1.  Create a new Request.
2.  Set Method to **POST**.
3.  Set URL to `http://localhost:8000/agent/memory`.
4.  Go to the **Body** tab.
5.  Select **raw**.
6.  In the dropdown next to "binary", select **JSON**.
7.  Paste this JSON:
    ```json
    {
        "query": "Hello, who are you?"
    }
    ```
