import requests

BASE_URL = "http://localhost:3002"
TIMEOUT = 30

def test_data_insights_dashboard_accuracy():
    session = requests.Session()

    # Test user credentials for signup and signin
    test_email = "testuser_data_insights@example.com"
    test_password = "TestPass123!"
    test_name = "Data Insights User"

    try:
        # Sign up user
        signup_payload = {
            "email": test_email,
            "password": test_password,
            "name": test_name
        }
        signup_resp = session.post(f"{BASE_URL}/api/auth/sign-up/email", json=signup_payload, timeout=TIMEOUT)
        assert signup_resp.status_code in (200, 201, 409, 422), f"Sign-up unexpected status {signup_resp.status_code}"
        # If 409 conflict because user exists or 422 validation error, continue to sign in

        # Sign in user
        signin_payload = {
            "email": test_email,
            "password": test_password
        }
        signin_resp = session.post(f"{BASE_URL}/api/auth/sign-in/email", json=signin_payload, timeout=TIMEOUT)
        assert signin_resp.status_code == 200, f"Sign-in failed with status {signin_resp.status_code}"

        # Create a new project
        project_payload = {
            "name": "Data Insights Test Project",
            "description": "Project for validating dashboard analytics accuracy."
        }
        create_proj_resp = session.post(f"{BASE_URL}/api/projects", json=project_payload, timeout=TIMEOUT)
        assert create_proj_resp.status_code == 201, f"Project creation failed with status {create_proj_resp.status_code}"
        project_data = create_proj_resp.json()
        project_id = project_data.get("id")
        assert project_id, "Project response missing id"

        # Create tasks within the project to generate data for dashboard analytics
        tasks = [
            {"title": "Initial Planning", "status": "completed"},
            {"title": "Development Phase", "status": "in-progress"},
            {"title": "Testing & QA", "status": "pending"},
        ]
        task_ids = []
        for task in tasks:
            task_payload = {
                "projectId": project_id,
                "title": task["title"],
                "status": task["status"]
            }
            create_task_resp = session.post(f"{BASE_URL}/api/tasks", json=task_payload, timeout=TIMEOUT)
            assert create_task_resp.status_code == 201, f"Task creation failed with status {create_task_resp.status_code}"
            task_data = create_task_resp.json()
            t_id = task_data.get("id")
            assert t_id, "Task response missing id"
            task_ids.append(t_id)

        # Retrieve dashboard data insights for the project
        # Assuming the analytics dashboard endpoint is /api/ai/dashboard/insights?projectId=...
        dashboard_resp = session.get(f"{BASE_URL}/api/ai/dashboard/insights", params={"projectId": project_id}, timeout=TIMEOUT)
        assert dashboard_resp.status_code == 200, f"Dashboard insights retrieval failed with status {dashboard_resp.status_code}"
        insights = dashboard_resp.json()

        # Validate the presence and structure of expected analytics fields
        assert "progressCharts" in insights, "Missing progressCharts in dashboard insights"
        assert isinstance(insights["progressCharts"], dict), "progressCharts should be a dict"

        assert "velocityTracking" in insights, "Missing velocityTracking in dashboard insights"
        assert isinstance(insights["velocityTracking"], dict), "velocityTracking should be a dict"

        assert "individualProductivityTrends" in insights, "Missing individualProductivityTrends in dashboard insights"
        assert isinstance(insights["individualProductivityTrends"], dict), "individualProductivityTrends should be a dict"

        # Basic sanity checks on values (counts/dates/progress percentages)
        progress = insights["progressCharts"].get("completionPercentage")
        assert isinstance(progress, (int, float)) and 0 <= progress <= 100, "Invalid completionPercentage in progressCharts"

        velocity = insights["velocityTracking"].get("averageVelocity")
        assert isinstance(velocity, (int, float)) and velocity >= 0, "Invalid averageVelocity in velocityTracking"

        productivity = insights["individualProductivityTrends"].get("userStats")
        assert isinstance(productivity, list), "individualProductivityTrends userStats should be a list"
        for user_stat in productivity:
            assert "userId" in user_stat and "completedTasks" in user_stat, "Missing fields in userStats element"
            assert isinstance(user_stat["completedTasks"], int) and user_stat["completedTasks"] >= 0, "Invalid completedTasks count"

    finally:
        # Cleanup: delete tasks and project if created
        for t_id in locals().get("task_ids", []):
            try:
                del_task_resp = session.delete(f"{BASE_URL}/api/tasks/{t_id}", timeout=TIMEOUT)
                assert del_task_resp.status_code == 204, f"Failed to delete task {t_id}"
            except Exception:
                pass

        if 'project_id' in locals():
            try:
                del_proj_resp = session.delete(f"{BASE_URL}/api/projects/{project_id}", timeout=TIMEOUT)
                assert del_proj_resp.status_code == 204, "Failed to delete project"
            except Exception:
                pass

test_data_insights_dashboard_accuracy()
