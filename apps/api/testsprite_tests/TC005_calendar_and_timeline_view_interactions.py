import requests
import uuid


BASE_URL = "http://localhost:3002/api"
TIMEOUT = 30


def test_calendar_and_timeline_view_interactions():
    session = requests.Session()

    # Generate unique email for sign-up
    unique_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
    password = "TestPass123!"
    name = "Test User"

    # Sign Up
    signup_resp = session.post(
        f"{BASE_URL}/auth/sign-up/email",
        json={"email": unique_email, "password": password, "name": name},
        timeout=TIMEOUT,
    )
    assert signup_resp.status_code == 200, f"Sign-up failed: {signup_resp.text}"

    # Sign In
    signin_resp = session.post(
        f"{BASE_URL}/api/auth/sign-in/email",
        json={"email": unique_email, "password": password},
        timeout=TIMEOUT,
    )
    assert signin_resp.status_code == 200, f"Sign-in failed: {signin_resp.text}"
    # Session cookies are automatically stored - no need to extract tokens

    project_id = None
    task_id = None
    try:
        # Create a project
        project_data = {
            "name": f"Calendar Test Project {uuid.uuid4().hex[:6]}",
            "description": "Project to test calendar and timeline interactions",
        }
        project_resp = session.post(f"{BASE_URL}/projects", json=project_data, timeout=TIMEOUT)
        assert project_resp.status_code == 201, f"Project creation failed: {project_resp.text}"
        project_json = project_resp.json()
        assert "id" in project_json, "Project ID missing in response"
        project_id = project_json["id"]

        # Quick Add: Create a task quickly in calendar view
        task_data = {
            "projectId": project_id,
            "title": "Initial Calendar Task",
            "status": "todo",
        }
        task_resp = session.post(f"{BASE_URL}/tasks", json=task_data, timeout=TIMEOUT)
        assert task_resp.status_code == 201, f"Task creation failed: {task_resp.text}"
        task_json = task_resp.json()
        assert "id" in task_json, "Task ID missing in response"
        task_id = task_json["id"]

        # Fetch tasks to validate calendar view shows the task
        tasks_list_resp = session.get(f"{BASE_URL}/tasks?projectId={project_id}", timeout=TIMEOUT)
        assert tasks_list_resp.status_code == 200, f"Fetching tasks list failed: {tasks_list_resp.text}"
        tasks = tasks_list_resp.json()
        assert any(t["id"] == task_id for t in tasks), "Created task not found in tasks list for calendar view"

        # Reschedule task: Change due date (simulate rescheduling via update)
        new_due_date = "2026-12-31T10:00:00Z"
        update_data = {"dueDate": new_due_date}
        patch_resp = session.put(f"{BASE_URL}/tasks/{task_id}", json=update_data, timeout=TIMEOUT)
        assert patch_resp.status_code == 200, f"Task rescheduling (update) failed: {patch_resp.text}"
        updated_task = patch_resp.json()
        assert updated_task.get("dueDate") == new_due_date, "Due date not updated on task"

        # Edit task details: Change title and status
        edit_data = {"title": "Updated Calendar Task Title", "status": "in-progress"}
        edit_resp = session.put(f"{BASE_URL}/tasks/{task_id}", json=edit_data, timeout=TIMEOUT)
        assert edit_resp.status_code == 200, f"Task editing failed: {edit_resp.text}"
        edited_task = edit_resp.json()
        assert edited_task.get("title") == edit_data["title"], "Task title not updated correctly"
        assert edited_task.get("status") == edit_data["status"], "Task status not updated correctly"

    finally:
        # Cleanup: delete created task and project if they exist
        if task_id:
            del_task_resp = session.delete(f"{BASE_URL}/tasks/{task_id}", timeout=TIMEOUT)
            assert del_task_resp.status_code in (200, 204), f"Failed to delete task: {del_task_resp.text}"
        if project_id:
            del_project_resp = session.delete(f"{BASE_URL}/projects/{project_id}", timeout=TIMEOUT)
            assert del_project_resp.status_code in (200, 204), f"Failed to delete project: {del_project_resp.text}"


test_calendar_and_timeline_view_interactions()
