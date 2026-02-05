import requests
import uuid

BASE_URL = "http://localhost:3002"

def test_notifications_api_user_notifications_and_settings():
    session = requests.Session()
    timeout = 30

    # Generate unique email for sign-up
    unique_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
    password = "TestPass123!"
    name = "Test User"

    # Sign up the user
    signup_payload = {
        "email": unique_email,
        "password": password,
        "name": name
    }
    signup_resp = session.post(f"{BASE_URL}/api/auth/sign-up/email", json=signup_payload, timeout=timeout)
    assert signup_resp.status_code in (200, 201), f"Sign-up failed: {signup_resp.text}"

    # Sign in the user
    signin_payload = {
        "email": unique_email,
        "password": password
    }
    signin_resp = session.post(f"{BASE_URL}/api/auth/sign-in/email", json=signin_payload, timeout=timeout)
    assert signin_resp.status_code == 200, f"Sign-in failed: {signin_resp.text}"
    # Session cookies are automatically stored - no need to extract tokens

    # -- Create notifications settings or fetch existing ones --
    # Assuming GET /api/notifications/settings fetches current user settings
    get_settings_resp = session.get(f"{BASE_URL}/api/notifications/settings", timeout=timeout)
    assert get_settings_resp.status_code == 200, f"Failed to get notification settings: {get_settings_resp.text}"
    settings_original = get_settings_resp.json()
    assert isinstance(settings_original, dict), "Notification settings should be a dictionary"

    try:
        # Update notification settings: example toggling email notifications or similar
        # Without schema details, assume settings JSON is a dict with keys representing preferences
        updated_settings = settings_original.copy()
        # Toggle a boolean preference if exists or add a dummy preference for testing
        if "emailNotifications" in updated_settings:
            updated_settings["emailNotifications"] = not updated_settings["emailNotifications"]
        else:
            updated_settings["emailNotifications"] = True

        update_settings_resp = session.put(
            f"{BASE_URL}/api/notifications/settings", json=updated_settings, timeout=timeout
        )
        assert update_settings_resp.status_code == 200, f"Failed to update notification settings: {update_settings_resp.text}"
        updated_settings_resp_json = update_settings_resp.json()
        assert updated_settings_resp_json.get("emailNotifications") == updated_settings["emailNotifications"], \
            "Notification setting update did not persist"

        # Simulate triggering a notification delivery
        # Assuming POST /api/notifications/send-test triggers a test notification delivery
        send_test_resp = session.post(f"{BASE_URL}/api/notifications/send-test", timeout=timeout)
        assert send_test_resp.status_code == 200, f"Failed to send test notification: {send_test_resp.text}"

        # Fetch user notifications list
        get_notifications_resp = session.get(f"{BASE_URL}/api/notifications", timeout=timeout)
        assert get_notifications_resp.status_code == 200, f"Failed to get user notifications: {get_notifications_resp.text}"
        notifications = get_notifications_resp.json()
        assert isinstance(notifications, list), "User notifications should be a list"

        # If there are notifications, verify the structure of at least one
        if notifications:
            notif = notifications[0]
            assert "id" in notif, "Notification missing 'id'"
            assert "message" in notif, "Notification missing 'message'"
            assert "read" in notif, "Notification missing 'read' status"

            # Test updating a notification preference per a notification, e.g. marking as read
            notification_id = notif["id"]
            mark_read_payload = {"read": True}
            mark_read_resp = session.put(
                f"{BASE_URL}/api/notifications/{notification_id}", json=mark_read_payload, timeout=timeout
            )
            assert mark_read_resp.status_code == 200, f"Failed to update notification read status: {mark_read_resp.text}"
            updated_notif = mark_read_resp.json()
            assert updated_notif.get("read") == True, "Notification read status update not persisted"

        else:
            # If no notifications, optionally ensure no error occurs when fetching empty list
            assert notifications == [], "Expected empty list of notifications"

    finally:
        # Clean up user - but no delete user endpoint provided, skip cleanup
        # If test environment requires, user cleanup may be done externally
        pass

test_notifications_api_user_notifications_and_settings()
