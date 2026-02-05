import requests
import os

BASE_URL = "http://localhost:3002/api"
TEST_EMAIL = "testuser_tc004@example.com"
TEST_PASSWORD = "TestPass123!"
TEST_NAME = "Test User TC004"

def test_ai_powered_document_analysis_and_task_generation():
    session = requests.Session()
    # Step 1: Sign up a new user
    signup_payload = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    }
    resp = session.post(f"{BASE_URL}/auth/sign-up/email", json=signup_payload, timeout=30)
    assert resp.status_code in (200, 201, 409), f"Unexpected signup status code: {resp.status_code}"
    # If user already exists (409), proceed to login

    # Step 2: Sign in user
    signin_payload = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    }
    resp = session.post(f"{BASE_URL}/auth/sign-in/email", json=signin_payload, timeout=30)
    assert resp.status_code == 200, f"Signin failed with status code: {resp.status_code}"

    project_id = None
    try:
        # Step 3: Create a project
        project_payload = {
            "name": "AI Document Analysis Project",
            "description": "Project to validate AI processing of academic documents and task generation"
        }
        resp = session.post(f"{BASE_URL}/projects", json=project_payload, timeout=30)
        assert resp.status_code == 201, f"Project creation failed: {resp.status_code}"
        project = resp.json()
        assert "id" in project, "Project ID not returned"
        project_id = project["id"]

        # Step 4: Upload academic document for AI analysis and task generation
        # Assume the AI API endpoint for document upload is /api/ai/documents with POST and multipart/form-data
        # Payload: file upload ("file": file), metadata with projectId
        # Create a sample text file to simulate academic document
        sample_document_content = (
            "Introduction\n"
            "This is a sample academic document for AI analysis.\n"
            "Key requirements:\n"
            "- Research related work\n"
            "- Design experiment setup\n"
            "- Collect data\n"
            "- Analyze results\n"
            "- Write conclusion\n"
        )
        file_path = "sample_academic_doc_tc004.txt"
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(sample_document_content)

        with open(file_path, "rb") as f:
            files = {"file": ("sample_academic_doc_tc004.txt", f, "text/plain")}
            data = {"projectId": project_id}
            resp = session.post(f"{BASE_URL}/ai/documents", files=files, data=data, timeout=30)

        os.remove(file_path)
        assert resp.status_code == 200, f"AI document upload failed: {resp.status_code}"
        analysis_result = resp.json()
        # Expected: AI extracts key requirements and generates tasks
        assert "tasks" in analysis_result, "No tasks field in AI analysis response"
        tasks = analysis_result["tasks"]
        assert isinstance(tasks, list) and len(tasks) > 0, "Tasks not generated or empty list"

        # Step 5: Validate tasks belong to project and have expected fields
        for task in tasks:
            assert "title" in task and isinstance(task["title"], str) and task["title"].strip() != "", "Task missing title"
            assert "status" in task and task["status"] in ("pending", "in-progress", "completed"), "Task has invalid or missing status"
            # Optional: validate task projectId matches
            assert "projectId" in task and task["projectId"] == project_id, "Task projectId mismatch"

        # Step 6: Optionally create tasks via /api/tasks for user acceptance (simulate acceptance)
        created_task_ids = []
        for task in tasks:
            task_payload = {
                "projectId": project_id,
                "title": task["title"],
                "status": task["status"]
            }
            task_resp = session.post(f"{BASE_URL}/tasks", json=task_payload, timeout=30)
            assert task_resp.status_code == 201, f"Task creation failed: {task_resp.status_code}"
            created_task = task_resp.json()
            assert "id" in created_task, "Created task missing id"
            created_task_ids.append(created_task["id"])

    finally:
        # Cleanup: delete created tasks and project
        if session:
            if 'created_task_ids' in locals():
                for tid in created_task_ids:
                    session.delete(f"{BASE_URL}/tasks/{tid}", timeout=30)
            if project_id:
                session.delete(f"{BASE_URL}/projects/{project_id}", timeout=30)
            # Optionally delete the user, but no endpoint info provided for user deletion

test_ai_powered_document_analysis_and_task_generation()
