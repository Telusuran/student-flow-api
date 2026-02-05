import requests
import uuid

BASE_URL = "http://localhost:3002"
TIMEOUT = 30

def test_user_authentication_and_profile_management():
    session = requests.Session()

    # Generate unique email for testing
    unique_email = f"testuser_{uuid.uuid4().hex}@example.com"
    password = "StrongP@ssw0rd!"
    name = "Test User"

    try:
        # 1. User Registration (Sign Up)
        sign_up_payload = {
            "email": unique_email,
            "password": password,
            "name": name
        }
        sign_up_resp = session.post(
            f"{BASE_URL}/api/auth/sign-up/email",
            json=sign_up_payload,
            timeout=TIMEOUT
        )
        assert sign_up_resp.status_code in (200, 201), f"Sign Up failed: {sign_up_resp.text}"
        sign_up_data = sign_up_resp.json()
        user_info = sign_up_data.get("user", {})
        assert user_info.get("email") == unique_email
        assert user_info.get("name") == name

        # 2. User Login (Sign In)
        sign_in_payload = {
            "email": unique_email,
            "password": password
        }
        sign_in_resp = session.post(
            f"{BASE_URL}/api/auth/sign-in/email",
            json=sign_in_payload,
            timeout=TIMEOUT
        )
        assert sign_in_resp.status_code == 200, f"Sign In failed: {sign_in_resp.text}"
        sign_in_data = sign_in_resp.json()
        user_info = sign_in_data.get("user", {})
        # Assuming the response returns user info like email and name on successful login
        assert user_info.get("email") == unique_email
        assert user_info.get("name") == name

        # 3. Password Recovery Request (simulate by sending request to typical endpoint)
        # Since PRD doesn't specify exact endpoint or body for password recovery,
        # try a standard route: POST /api/auth/password-recovery/email with email payload
        # If no such endpoint, skip this step or assert 404 is acceptable.
        pr_payload = {"email": unique_email}
        pr_resp = session.post(
            f"{BASE_URL}/api/auth/password-recovery/email",
            json=pr_payload,
            timeout=TIMEOUT
        )
        assert pr_resp.status_code in (200, 202, 204), f"Password recovery request failed: {pr_resp.text}"

        # 4. Profile Update (PATCH or PUT /api/users/profile)
        # From PRD user API routes: /api/users routes available
        # Assume PUT /api/users/profile with body {"name": "...", "email": "..."} allowed for update
        updated_name = "Updated Test User"
        profile_update_payload = {
            "name": updated_name
        }
        profile_update_resp = session.put(
            f"{BASE_URL}/api/users/profile",
            json=profile_update_payload,
            timeout=TIMEOUT
        )
        assert profile_update_resp.status_code == 200, f"Profile update failed: {profile_update_resp.text}"
        profile_data = profile_update_resp.json()
        assert profile_data.get("name") == updated_name

        # 5. Get Profile to Confirm Update (GET /api/users/profile)
        profile_get_resp = session.get(
            f"{BASE_URL}/api/users/profile",
            timeout=TIMEOUT
        )
        assert profile_get_resp.status_code == 200, f"Get profile failed: {profile_get_resp.text}"
        profile_get_data = profile_get_resp.json()
        assert profile_get_data.get("email") == unique_email
        assert profile_get_data.get("name") == updated_name

    finally:
        # Cleanup: If API has a user deletion endpoint, delete test user
        # Assumed DELETE /api/users/profile or /api/users (if supported)
        session.delete(f"{BASE_URL}/api/auth/sign-out", timeout=TIMEOUT)
        # No user deletion endpoint specified in PRD, so skipping deletion step


test_user_authentication_and_profile_management()
