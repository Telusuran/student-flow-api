import requests
import uuid

def test_multi_step_project_creation_wizard():
    base_url = "http://localhost:3002"
    session = requests.Session()
    timeout = 30

    # Credentials for test user
    test_email = f"testuser_{uuid.uuid4()}@example.com"
    test_password = "TestPassword123!"
    test_name = "Test User"

    # Step 1: Sign up user
    signup_payload = {
        "email": test_email,
        "password": test_password,
        "name": test_name
    }
    signup_resp = session.post(
        f"{base_url}/api/auth/sign-up/email",
        json=signup_payload,
        timeout=timeout
    )
    assert signup_resp.status_code == 200, f"Sign-up failed: {signup_resp.text}"

    # Step 2: Sign in user
    signin_payload = {
        "email": test_email,
        "password": test_password
    }
    signin_resp = session.post(
        f"{base_url}/api/auth/sign-in/email",
        json=signin_payload,
        timeout=timeout
    )
    assert signin_resp.status_code == 200, f"Sign-in failed: {signin_resp.text}"
    # Session cookies are automatically stored - no need to extract tokens

    project_id = None
    task_ids = []
    try:
        # Step 3: Create Project (multi-step wizard step 1)
        project_payload = {
            "name": "Multi Step Project " + str(uuid.uuid4()),
            "description": "Testing multi-step project creation with AI generated tasks and timeline suggestions"
        }
        project_resp = session.post(
            f"{base_url}/api/projects",
            json=project_payload,
            timeout=timeout
        )
        assert project_resp.status_code == 201, f"Project creation failed: {project_resp.text}"
        project_data = project_resp.json()
        assert "id" in project_data, "Project ID not returned"
        project_id = project_data["id"]

        # Step 4: Simulate AI task breakdowns - create some tasks linked to project
        ai_task_suggestions = [
            {"title": "Research topic and gather references", "status": "pending"},
            {"title": "Outline project milestones and timeline", "status": "pending"},
            {"title": "Draft initial report", "status": "pending"}
        ]
        for task in ai_task_suggestions:
            task_payload = {
                "projectId": project_id,
                "title": task["title"],
                "status": task["status"]
            }
            task_resp = session.post(
                f"{base_url}/api/tasks",
                json=task_payload,
                timeout=timeout
            )
            assert task_resp.status_code == 201, f"Task creation failed: {task_resp.text}"
            task_data = task_resp.json()
            assert "id" in task_data, "Task ID not returned"
            task_ids.append(task_data["id"])

        # Step 5: Confirm project appears correctly in dashboard
        # Assuming dashboard shows projects at /api/projects (GET)
        dashboard_resp = session.get(
            f"{base_url}/api/projects",
            timeout=timeout
        )
        assert dashboard_resp.status_code == 200, f"Failed to get dashboard projects: {dashboard_resp.text}"
        projects_list = dashboard_resp.json()
        assert isinstance(projects_list, list), "Projects list should be a list"
        project_ids_in_dashboard = [p.get("id") for p in projects_list if "id" in p]
        assert project_id in project_ids_in_dashboard, "Created project not found in dashboard"

    finally:
        # Cleanup created tasks
        for tid in task_ids:
            try:
                del_resp = session.delete(f"{base_url}/api/tasks/{tid}", timeout=timeout)
                # It's okay if deletion fails, just attempt
            except Exception:
                pass

        # Cleanup created project
        if project_id:
            try:
                del_proj_resp = session.delete(f"{base_url}/api/projects/{project_id}", timeout=timeout)
                # Ignore errors
            except Exception:
                pass

test_multi_step_project_creation_wizard()
