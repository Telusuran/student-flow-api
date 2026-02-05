import requests
import os

BASE_URL = "http://localhost:3002"


def test_resource_management_file_and_link_uploads():
    session = requests.Session()
    timeout = 30
    test_email = "romi@example.com"
    test_password = "RomiPass123!"
    test_name = "Romi User"

    # Signup and signin
    signup_data = {"email": test_email, "password": test_password, "name": test_name}
    resp = session.post(f"{BASE_URL}/api/auth/sign-up/email", json=signup_data, timeout=timeout)
    assert resp.status_code == 201 or resp.status_code == 409 or resp.status_code == 200, f"Signup failed: {resp.text}"

    signin_data = {"email": test_email, "password": test_password}
    resp = session.post(f"{BASE_URL}/api/auth/sign-in/email", json=signin_data, timeout=timeout)
    assert resp.status_code == 200, f"Signin failed: {resp.text}"

    project = None
    task = None
    resource_file = None
    resource_link = None
    try:
        # Create project
        project_data = {"name": "Test Project for Resource Upload", "description": "Project desc for resource upload test"}
        resp = session.post(f"{BASE_URL}/api/projects", json=project_data, timeout=timeout)
        assert resp.status_code == 201, f"Project creation failed: {resp.text}"
        project = resp.json()
        project_id = project.get("id")
        assert project_id, "Project ID missing in response"

        # Create task linked to project
        task_data = {"projectId": project_id, "title": "Test Task for Resource Upload", "status": "todo"}
        resp = session.post(f"{BASE_URL}/api/tasks", json=task_data, timeout=timeout)
        assert resp.status_code == 201, f"Task creation failed: {resp.text}"
        task = resp.json()
        task_id = task.get("id")
        assert task_id, "Task ID missing in response"

        # Upload file resource linked to project and task
        files = {
            "file": ("testfile.txt", b"Hello, this is a test file for upload.", "text/plain"),
        }
        data = {
            "projectId": project_id,
            "taskId": task_id,
            "tags": "test,upload,file",
            "version": "1.0",
            "type": "file"
        }
        resp = session.post(f"{BASE_URL}/api/resources/files", data=data, files=files, timeout=timeout)
        assert resp.status_code == 201, f"File upload failed: {resp.text}"
        resource_file = resp.json()
        resource_file_id = resource_file.get("id")
        assert resource_file_id, "Uploaded file resource ID missing"
        assert resource_file.get("version") == "1.0"
        assert "file" in resource_file.get("type", "")

        # Upload link resource linked to project and task
        link_data = {
            "projectId": project_id,
            "taskId": task_id,
            "url": "https://example.com/resource-link",
            "tags": "test,upload,link",
            "version": "1.0",
            "type": "link"
        }
        resp = session.post(f"{BASE_URL}/api/resources/links", json=link_data, timeout=timeout)
        assert resp.status_code == 201, f"Link upload failed: {resp.text}"
        resource_link = resp.json()
        resource_link_id = resource_link.get("id")
        assert resource_link_id, "Uploaded link resource ID missing"
        assert resource_link.get("version") == "1.0"
        assert "link" in resource_link.get("type", "")

        # Verify version tracking: upload a new version for the file resource
        files_v2 = {
            "file": ("testfile_v2.txt", b"Second version of the test file content.", "text/plain"),
        }
        data_v2 = {
            "projectId": project_id,
            "taskId": task_id,
            "tags": "test,upload,file,v2",
            "version": "2.0",
            "type": "file"
        }
        resp = session.post(f"{BASE_URL}/api/resources/files", data=data_v2, files=files_v2, timeout=timeout)
        assert resp.status_code == 201, f"File upload v2 failed: {resp.text}"
        resource_file_v2 = resp.json()
        assert resource_file_v2.get("version") == "2.0"
        assert resource_file_v2.get("id") != resource_file_id  # New resource created for new version

        # Retrieve the file resource including versions or metadata if available
        resp = session.get(f"{BASE_URL}/api/resources/{resource_file_id}", timeout=timeout)
        assert resp.status_code == 200, f"Get resource file failed: {resp.text}"
        file_resource_detail = resp.json()
        assert file_resource_detail.get("id") == resource_file_id

        # Retrieve the link resource
        resp = session.get(f"{BASE_URL}/api/resources/{resource_link_id}", timeout=timeout)
        assert resp.status_code == 200, f"Get resource link failed: {resp.text}"
        link_resource_detail = resp.json()
        assert link_resource_detail.get("id") == resource_link_id

    finally:
        # Cleanup uploaded resources
        if resource_file:
            session.delete(f"{BASE_URL}/api/resources/{resource_file.get('id')}", timeout=timeout)
        if resource_file and 'resource_file_v2' in locals():
            session.delete(f"{BASE_URL}/api/resources/{resource_file_v2.get('id')}", timeout=timeout)
        if resource_link:
            session.delete(f"{BASE_URL}/api/resources/{resource_link.get('id')}", timeout=timeout)
        # Cleanup task and project
        if task:
            session.delete(f"{BASE_URL}/api/tasks/{task.get('id')}", timeout=timeout)
        if project:
            session.delete(f"{BASE_URL}/api/projects/{project.get('id')}", timeout=timeout)


test_resource_management_file_and_link_uploads()
