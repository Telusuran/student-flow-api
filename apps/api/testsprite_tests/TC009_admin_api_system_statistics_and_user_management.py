import requests
import uuid

BASE_URL = "http://localhost:3002"

def test_tc009_admin_api_system_statistics_and_user_management():
    session = requests.Session()
    timeout = 30

    # Unique email to avoid conflicts
    test_email = f"testadmin_{uuid.uuid4().hex[:8]}@example.com"
    test_password = "TestPass123!"
    test_name = "Test Admin User"

    # 1. Sign up new user
    sign_up_payload = {
        "email": test_email,
        "password": test_password,
        "name": test_name
    }
    sign_up_resp = session.post(
        f"{BASE_URL}/api/auth/sign-up/email",
        json=sign_up_payload,
        timeout=timeout
    )
    assert sign_up_resp.status_code == 200, f"Sign-up failed: {sign_up_resp.text}"

    # 2. Sign in with created user to get token
    sign_in_payload = {
        "email": test_email,
        "password": test_password
    }
    sign_in_resp = session.post(
        f"{BASE_URL}/api/auth/sign-in/email",
        json=sign_in_payload,
        timeout=timeout
    )
    assert sign_in_resp.status_code == 200, f"Sign-in failed: {sign_in_resp.text}"
    # Session cookies are automatically stored - no need to extract tokens

    # 3. Create a project to manage and oversee (keep session for cookies auth)
    project_name = f"Test Project {uuid.uuid4().hex[:8]}"
    project_description = "Project description for admin API testing"
    project_payload = {
        "name": project_name,
        "description": project_description
    }
    create_project_resp = session.post(
        f"{BASE_URL}/api/projects",
        json=project_payload,
        timeout=timeout
    )
    assert create_project_resp.status_code == 201, f"Project creation failed: {create_project_resp.text}"
    project_data = create_project_resp.json()
    assert "id" in project_data, "Project creation response missing 'id'"
    project_id = project_data["id"]

    try:
        # 4. Retrieve system statistics from admin API
        sys_stats_resp = session.get(
            f"{BASE_URL}/api/admin/system-stats",
            
            timeout=timeout
        )
        assert sys_stats_resp.status_code == 200, f"Failed to get system stats: {sys_stats_resp.text}"
        sys_stats_json = sys_stats_resp.json()
        assert isinstance(sys_stats_json, dict), "System stats response is not a dict"
        # Basic expected fields for system stats (example)
        assert "totalUsers" in sys_stats_json, "System stats missing 'totalUsers'"
        assert "totalProjects" in sys_stats_json, "System stats missing 'totalProjects'"

        # 5. List users (user management)
        users_resp = session.get(
            f"{BASE_URL}/api/admin/users",
            
            timeout=timeout
        )
        assert users_resp.status_code == 200, f"Failed to list users: {users_resp.text}"
        users_json = users_resp.json()
        assert isinstance(users_json, list), "Users list response is not a list"
        # Verify our test user is in the user list
        user_emails = [user.get("email") for user in users_json if "email" in user]
        assert test_email in user_emails, "Test user email not found in user management list"

        # 6. Get user details by user id
        # Find the user id of our test user
        test_user = next((u for u in users_json if u.get("email") == test_email), None)
        assert test_user is not None, "Test user not found in users list"
        test_user_id = test_user.get("id")
        assert test_user_id, "Test user missing 'id'"

        user_detail_resp = session.get(
            f"{BASE_URL}/api/admin/users/{test_user_id}",
            
            timeout=timeout
        )
        assert user_detail_resp.status_code == 200, f"Failed to get user details: {user_detail_resp.text}"
        user_detail_json = user_detail_resp.json()
        assert user_detail_json.get("email") == test_email, "User detail email mismatch"
        assert user_detail_json.get("name") == test_name, "User detail name mismatch"

        # 7. Update user name (example of user management)
        new_name = f"{test_name} Updated"
        update_payload = {"name": new_name}
        update_user_resp = session.put(
            f"{BASE_URL}/api/admin/users/{test_user_id}",
            json=update_payload,
            
            timeout=timeout
        )
        assert update_user_resp.status_code == 200, f"Failed to update user: {update_user_resp.text}"
        updated_user_json = update_user_resp.json()
        assert updated_user_json.get("name") == new_name, "User name was not updated"

        # 8. List projects under admin oversight
        projects_resp = session.get(
            f"{BASE_URL}/api/admin/projects",
            
            timeout=timeout
        )
        assert projects_resp.status_code == 200, f"Failed to list projects from admin: {projects_resp.text}"
        projects_json = projects_resp.json()
        assert isinstance(projects_json, list), "Admin projects list is not a list"
        project_ids = [proj.get("id") for proj in projects_json if "id" in proj]
        assert project_id in project_ids, "Created project not found in admin project list"

    finally:
        # Cleanup: delete created project
        del_project_resp = session.delete(
            f"{BASE_URL}/api/projects/{project_id}",
            timeout=timeout
        )
        # It's okay if deletion fails - just try best effort
        assert del_project_resp.status_code in (200, 204), f"Failed to delete project: {del_project_resp.status_code}"

        # There is no explicit API to delete users in the PRD, so no delete user here

test_tc009_admin_api_system_statistics_and_user_management()
