import requests
import uuid

BASE_URL = "http://localhost:3002"
TIMEOUT = 30

def test_comprehensive_task_management_operations():
    session = requests.Session()
    user_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
    user_password = "TestPass123!"
    user_name = "Test User"

    project_id = None
    task_ids = []
    try:
        # Sign up
        signup_resp = session.post(
            f"{BASE_URL}/api/auth/sign-up/email",
            json={"email": user_email, "password": user_password, "name": user_name},
            timeout=TIMEOUT,
        )
        assert signup_resp.status_code == 201 or signup_resp.status_code == 200, f"Signup failed: {signup_resp.text}"

        # Sign in
        signin_resp = session.post(
            f"{BASE_URL}/api/auth/sign-in/email",
            json={"email": user_email, "password": user_password},
            timeout=TIMEOUT,
        )
        assert signin_resp.status_code == 200, f"Signin failed: {signin_resp.text}"
        # Session cookies are automatically stored by requests.Session()
        # No need to extract tokens - Better Auth uses cookies

        # Create a project
        project_name = f"Test Project {uuid.uuid4().hex[:6]}"
        project_description = "Project for task CRUD operations testing"
        project_resp = session.post(
            f"{BASE_URL}/api/projects",
            json={"name": project_name, "description": project_description},
            timeout=TIMEOUT,
        )
        assert project_resp.status_code == 201 or project_resp.status_code == 200, f"Project creation failed: {project_resp.text}"
        project_data = project_resp.json()
        project_id = project_data.get("id")
        assert project_id, "Project ID missing in response"

        # CREATE root task
        task1_resp = session.post(
            f"{BASE_URL}/api/tasks",
            json={"projectId": project_id, "title": "Root Task", "status": "todo"},
            headers=headers,
            timeout=TIMEOUT,
        )
        assert task1_resp.status_code == 201 or task1_resp.status_code == 200, f"Root task creation failed: {task1_resp.text}"
        task1 = task1_resp.json()
        task1_id = task1.get("id")
        assert task1_id, "Root task ID missing"
        task_ids.append(task1_id)

        # CREATE nested subtask 1
        subtask1_resp = session.post(
            f"{BASE_URL}/api/tasks",
            json={"projectId": project_id, "title": "Subtask 1", "status": "todo", "parentId": task1_id},
            headers=headers,
            timeout=TIMEOUT,
        )
        assert subtask1_resp.status_code == 201 or subtask1_resp.status_code == 200, f"Subtask 1 creation failed: {subtask1_resp.text}"
        subtask1 = subtask1_resp.json()
        subtask1_id = subtask1.get("id")
        assert subtask1_id, "Subtask 1 ID missing"
        task_ids.append(subtask1_id)

        # CREATE nested subtask 2
        subtask2_resp = session.post(
            f"{BASE_URL}/api/tasks",
            json={"projectId": project_id, "title": "Subtask 2", "status": "todo", "parentId": task1_id},
            headers=headers,
            timeout=TIMEOUT,
        )
        assert subtask2_resp.status_code == 201 or subtask2_resp.status_code == 200, f"Subtask 2 creation failed: {subtask2_resp.text}"
        subtask2 = subtask2_resp.json()
        subtask2_id = subtask2.get("id")
        assert subtask2_id, "Subtask 2 ID missing"
        task_ids.append(subtask2_id)

        # UPDATE status of root task to "in-progress"
        update_root_status_resp = session.put(
            f"{BASE_URL}/api/tasks/{task1_id}",
            json={"status": "in-progress"},
            headers=headers,
            timeout=TIMEOUT,
        )
        assert update_root_status_resp.status_code == 200, f"Updating root task status failed: {update_root_status_resp.text}"
        updated_root_task = update_root_status_resp.json()
        assert updated_root_task.get("status") == "in-progress", "Root task status update not applied"

        # Set dependency: subtask2 depends on subtask1
        update_dep_resp = session.put(
            f"{BASE_URL}/api/tasks/{subtask2_id}",
            json={"dependencies": [subtask1_id]},
            headers=headers,
            timeout=TIMEOUT,
        )
        assert update_dep_resp.status_code == 200, f"Setting dependency failed: {update_dep_resp.text}"
        updated_subtask2 = update_dep_resp.json()
        deps = updated_subtask2.get("dependencies", [])
        assert subtask1_id in deps or str(subtask1_id) in [str(d) for d in deps], "Dependency not set properly"

        # REORDER tasks
        reorder_resp1 = session.put(
            f"{BASE_URL}/api/tasks/{task1_id}",
            json={"priority": 1},
            headers=headers,
            timeout=TIMEOUT,
        )
        assert reorder_resp1.status_code == 200, f"Updating root task priority failed: {reorder_resp1.text}"

        reorder_resp2 = session.put(
            f"{BASE_URL}/api/tasks/{subtask1_id}",
            json={"priority": 2},
            headers=headers,
            timeout=TIMEOUT,
        )
        assert reorder_resp2.status_code == 200, f"Updating subtask1 priority failed: {reorder_resp2.text}"

        reorder_resp3 = session.put(
            f"{BASE_URL}/api/tasks/{subtask2_id}",
            json={"priority": 3},
            headers=headers,
            timeout=TIMEOUT,
        )
        assert reorder_resp3.status_code == 200, f"Updating subtask2 priority failed: {reorder_resp3.text}"

        # VERIFY priorities updated correctly
        get_root_task = session.get(f"{BASE_URL}/api/tasks/{task1_id}", timeout=TIMEOUT)
        assert get_root_task.status_code == 200, f"Failed to get root task after priority update: {get_root_task.text}"
        task_root_data = get_root_task.json()
        assert task_root_data.get("priority") == 1, "Root task priority not updated correctly"

        get_subtask1 = session.get(f"{BASE_URL}/api/tasks/{subtask1_id}", timeout=TIMEOUT)
        assert get_subtask1.status_code == 200, f"Failed to get subtask1 after priority update: {get_subtask1.text}"
        task_sub1_data = get_subtask1.json()
        assert task_sub1_data.get("priority") == 2, "Subtask1 priority not updated correctly"

        get_subtask2 = session.get(f"{BASE_URL}/api/tasks/{subtask2_id}", timeout=TIMEOUT)
        assert get_subtask2.status_code == 200, f"Failed to get subtask2 after priority update: {get_subtask2.text}"
        task_sub2_data = get_subtask2.json()
        assert task_sub2_data.get("priority") == 3, "Subtask2 priority not updated correctly"

        # DELETE subtask2
        del_subtask2_resp = session.delete(f"{BASE_URL}/api/tasks/{subtask2_id}", timeout=TIMEOUT)
        assert del_subtask2_resp.status_code == 204 or del_subtask2_resp.status_code == 200, f"Failed to delete subtask2: {del_subtask2_resp.text}"
        task_ids.remove(subtask2_id)

        # VERIFY subtask2 deleted
        get_del_subtask2 = session.get(f"{BASE_URL}/api/tasks/{subtask2_id}", timeout=TIMEOUT)
        assert get_del_subtask2.status_code == 404, f"Deleted subtask2 still accessible: {get_del_subtask2.text}"

        # UPDATE subtask1 title and status
        update_subtask1_resp = session.put(
            f"{BASE_URL}/api/tasks/{subtask1_id}",
            json={"title": "Updated Subtask 1 Title", "status": "done"},
            headers=headers,
            timeout=TIMEOUT,
        )
        assert update_subtask1_resp.status_code == 200, f"Failed to update subtask1: {update_subtask1_resp.text}"
        updated_sub1 = update_subtask1_resp.json()
        assert updated_sub1.get("title") == "Updated Subtask 1 Title", "Subtask1 title not updated"
        assert updated_sub1.get("status") == "done", "Subtask1 status not updated"

    finally:
        for tid in task_ids:
            try:
                session.delete(f"{BASE_URL}/api/tasks/{tid}", timeout=TIMEOUT)
            except Exception:
                pass

        if project_id:
            try:
                session.delete(f"{BASE_URL}/api/projects/{project_id}", timeout=TIMEOUT)
            except Exception:
                pass


test_comprehensive_task_management_operations()
