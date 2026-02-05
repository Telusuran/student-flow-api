# CMS Product Specification

## 1. Product Overview

**Product Name:** Student Flow CMS

**Vision:** A centralized, intuitive administrative dashboard designed to streamline the management of users, projects, and educational resources within the Student Flow ecosystem. The CMS empowers administrators and mentors to effectively oversee student progress and content delivery.

## 2. Target Audience

*   **Administrators:** Primary users responsible for user management, system-wide settings, and high-level project oversight.
*   **Mentors:** Users who guide students, manage specific projects, and upload/curate reosurces.

## 3. User Roles and Permissions

*   **Admin:** Full access to all modules (User Management, Project Management, Resource Management, System Settings).
*   **Mentor:** Access to Project Management and Resource Management; limited read-only access to Student lists.
*   **Student:** No access to CMS (Consumer only).

## 4. Key Features & Functional Requirements

### 4.1. Authentication
*   **Secure Access:** Login is required to access any part of the CMS.
*   **Session Management:** Persistent sessions via encryption/tokens (`better-auth`).
*   **Automatic Redirects:** Unauthenticated users are redirected to the Login page.

### 4.2. Dashboard
*   **Overview:** Provides high-level metrics and system status (TBD: Specific metrics like active users count, project completion rates).
*   **Navigation:** Central hub for navigating to other modules.

### 4.3. User Management (`/users`)
*   **User Listing:** Display a paginated/scrollable list of all registered users.
    *   Columns: Avatar, Name, Email, Role, Joined Date, Actions.
*   **Search & Filter:**
    *   Search by Name or Email.
    *   Filter by Role (Student, Mentor, Admin, All).
*   **CRUD Operations:**
    *   **Edit User:** Update Name, Email, and Role assignments.
    *   **Delete User:** Remove a user from the system (with confirmation).
    *   **Bulk Actions:** Select multiple users to delete in batch.
*   **Data Export:** Export the filtered user list to CSV format for external analysis.

### 4.4. Project Management (`/projects`)
*   **Project Listing:** Grid view card layout for browsing projects.
    *   Indicators: Project Icon/Color, Name, Course Code, Description preview.
    *   Status Badges: Active (Green), Archived (Gray), Deleted (Red).
    *   Progress Bar: Visual representation of completion percentage.
    *   Due Date display.
*   **Search & Filter:**
    *   Search by Project Name or Course Code.
    *   Filter by Status (Active, Archived, Deleted).
*   **Project Actions:**
    *   **Quick Status Update:** Change status directly from the card.
    *   **Edit Project:** Modify Name, Description, and Status.
    *   **Delete Project:** Soft or hard delete (with confirmation warning about associated tasks/resources).
    *   **View Details:** Navigate to a detailed view of the project.

### 4.5. Resource Management (`/resources`)
*   **Project Context:** Resources are organized by Project. Users must select a project to view its files.
*   **File Explorer Interface:**
    *   Breadcrumb navigation for traversing folder hierarchies.
    *   Grid/List view of files and folders.
*   **File Operations:**
    *   **Upload:** Support for uploading files to specific folders.
    *   **Folder Creation:** "New Folder" functionality to organize content.
    *   **Navigation:** Deep navigation into creating sub-directories.

### 4.6. Profile Management (`/profile`)
*   **Self-Service:** Admins/Mentors can manage their own profile details (Name, Password, etc. - based on general App routes).

## 5. Technical Stack

*   **Frontend Framework:** React 19 (Vite)
*   **Styling:** Tailwind CSS (Responsive, Modern UI)
*   **State Management/Data Fetching:** React Query (`@tanstack/react-query`) for efficient server state caching and synchronization.
*   **Authentication:** `better-auth` for secure role-based access control.
*   **API Integration:** Custom `apiClient` wrapper for RESTful communication with the backend.

## 6. UX/UI Design Guidelines

*   **Layout:** Responsive Sidebar layout (`Layout` component) allowing easy switching between modules.
*   **Feedback:** Toast notifications or Alerts for success/error states (e.g., "Failed to update project").
*   **Modals:** Use overlays for complex actions like Editing or Creating items to maintain context.
*   **Data Density:** Use Tables for high-density data (Users) and Cards for rich content (Projects).
