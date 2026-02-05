import requests
import uuid

BASE_URL = "http://localhost:3002"


def test_real_time_collaboration_messaging_and_notifications():
    session = requests.Session()
    signup_url = f"{BASE_URL}/api/auth/sign-up/email"
    signin_url = f"{BASE_URL}/api/auth/sign-in/email"
    projects_url = f"{BASE_URL}/api/projects"
    messaging_url_template = f"{BASE_URL}/api/projects/{{project_id}}/messages"
    notifications_settings_url = f"{BASE_URL}/api/notifications/settings"

    email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
    password = "TestPass123!"
    name = "Test User"

    # 1. Sign up user
    resp = session.post(
        signup_url,
        json={"email": email, "password": password, "name": name},
        timeout=30,
    )
    assert resp.status_code == 200, f"Signup failed: {resp.text}"

    # 2. Sign in user
    resp = session.post(
        signin_url,
        json={"email": email, "password": password},
        timeout=30,
    )
    assert resp.status_code == 200, f"Signin failed: {resp.text}"
    # Session cookies are automatically stored - no need to extract tokens

    # 3. Create a project for messaging
    project_name = "Collaboration Test Project"
    project_description = "Project to test real-time messaging and notifications"
    resp = session.post(
        projects_url,
        json={"name": project_name, "description": project_description},
        timeout=30,
    )
    assert resp.status_code == 201, f"Project creation failed: {resp.text}"
    project = resp.json()
    project_id = project.get("id")
    assert project_id, "Project ID missing in create response"

    try:
        # 4. Send a message to project channel
        message_payload = {"content": "Hello team, this is a real-time test message."}
        messaging_url = messaging_url_template.format(project_id=project_id)
        resp = session.post(messaging_url, json=message_payload, timeout=30)
        assert resp.status_code == 201, f"Sending message failed: {resp.text}"
        message = resp.json()
        message_id = message.get("id")
        assert message_id, "Message ID missing after sending"

        # 5. Send a threaded reply to the above message
        thread_message_payload = {
            "content": "Reply in thread: Confirming receipt.",
            "parentMessageId": message_id,
        }
        resp = session.post(messaging_url, json=thread_message_payload, timeout=30)
        assert resp.status_code == 201, f"Sending threaded message failed: {resp.text}"
        thread_message = resp.json()
        assert (
            thread_message.get("parentMessageId") == message_id
        ), "Thread message parentMessageId mismatch"

        # 6. Retrieve messages and check thread structure
        resp = session.get(messaging_url, timeout=30)
        assert resp.status_code == 200, f"Fetching messages failed: {resp.text}"
        messages_list = resp.json()
        assert any(m.get("id") == message_id for m in messages_list), "Main message missing"
        assert any(
            m.get("parentMessageId") == message_id for m in messages_list
        ), "Threaded message missing"

        # 7. Get current notification settings
        resp = session.get(notifications_settings_url, timeout=30)
        assert resp.status_code == 200, f"Fetching notification settings failed: {resp.text}"
        current_settings = resp.json()
        assert isinstance(current_settings, dict), "Notification settings response invalid"

        # 8. Update granular notification settings: enable mentions only
        updated_settings = {"notifyOnMentionsOnly": True}
        resp = session.put(
            notifications_settings_url, json=updated_settings, timeout=30
        )
        assert resp.status_code == 200, f"Updating notification settings failed: {resp.text}"
        new_settings = resp.json()
        assert (
            new_settings.get("notifyOnMentionsOnly") is True
        ), "Notification setting update not reflected"

    finally:
        # Cleanup: delete project and all related data
        if project_id:
            del_url = f"{projects_url}/{project_id}"
            resp = session.delete(del_url, timeout=30)
            assert resp.status_code in (200, 204), f"Project deletion failed: {resp.text}"


test_real_time_collaboration_messaging_and_notifications()
