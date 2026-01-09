import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from './layouts/DashboardLayout'
import { DashboardPage } from './pages/DashboardPage'
import { ProjectPage } from './pages/ProjectPage'



import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetConfirmationPage } from './pages/ResetConfirmationPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { ResetSuccessPage } from './pages/ResetSuccessPage'
import { ProfileSetupPage } from './pages/ProfileSetupPage'
import { EditProfilePage } from './pages/EditProfilePage'
import { AccountSettingsPage } from './pages/AccountSettingsPage'
import { DeleteAccountPage } from './pages/DeleteAccountPage'
import { AccountDeletedPage } from './pages/AccountDeletedPage'
import { CreateProjectPage } from './pages/CreateProjectPage'
import { CreateProjectTimelinePage } from './pages/CreateProjectTimelinePage'
import { CreateProjectReviewPage } from './pages/CreateProjectReviewPage'
import { ProjectSettingsPage } from './pages/ProjectSettingsPage'
import { DeleteProjectPage } from './pages/DeleteProjectPage'
import { ProjectDeletedPage } from './pages/ProjectDeletedPage'
import { ArchivedProjectsPage } from './pages/ArchivedProjectsPage'
import { RestoreProjectPage } from './pages/RestoreProjectPage'
import { RestoreProjectSuccessPage } from './pages/RestoreProjectSuccessPage'
import { TaskDetailsPage } from './pages/TaskDetailsPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { NotificationSettingsPage } from './pages/NotificationSettingsPage'
import { ResourceManagementPage } from './pages/ResourceManagementPage'
import { AddLinkedFilePage } from './pages/AddLinkedFilePage'
import { ProjectMessagingPage } from './pages/ProjectMessagingPage'
import { ProjectCalendarPage } from './pages/ProjectCalendarPage'
import { DataInsightPage } from './pages/DataInsightPage'
import { ProjectSpacePage } from './pages/ProjectSpacePage'
import { DocumentAnalyzerPage } from './pages/DocumentAnalyzerPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard Routes - Protected/Internal */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/project" element={<ProjectPage />} />

          <Route path="/project/messages" element={<ProjectMessagingPage />} />
          <Route path="/calendar" element={<ProjectCalendarPage />} />
          <Route path="/project/:projectId/resources" element={<ResourceManagementPage />} />
          <Route path="/data-insight" element={<DataInsightPage />} />
          <Route path="/ai/analyze" element={<DocumentAnalyzerPage />} />
          <Route path="/settings/account" element={<AccountSettingsPage />} />
          <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
        </Route>

        {/* Public/Standalone Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-confirmation" element={<ResetConfirmationPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/reset-success" element={<ResetSuccessPage />} />
        <Route path="/profile-setup" element={<ProfileSetupPage />} />
        <Route path="/settings/profile" element={<EditProfilePage />} />
        <Route path="/settings/account" element={<AccountSettingsPage />} />
        <Route path="/settings/delete-account" element={<DeleteAccountPage />} />
        <Route path="/account-deleted" element={<AccountDeletedPage />} />
        <Route path="/create-project" element={<CreateProjectPage />} />
        <Route path="/create-project/timeline" element={<CreateProjectTimelinePage />} />
        <Route path="/create-project/review" element={<CreateProjectReviewPage />} />
        <Route path="/project/settings" element={<ProjectSettingsPage />} />
        <Route path="/project/delete" element={<DeleteProjectPage />} />
        <Route path="/project/deleted" element={<ProjectDeletedPage />} />
        <Route path="/archived" element={<ArchivedProjectsPage />} />
        <Route path="/project/restore" element={<RestoreProjectPage />} />
        <Route path="/project/restore/success" element={<RestoreProjectSuccessPage />} />
        <Route path="/project/task/:taskId" element={<TaskDetailsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
        {/* Resource routes moved to DashboardLayout */}
        <Route path="/project/resources/add" element={<AddLinkedFilePage />} />
        <Route path="/project/messages" element={<ProjectMessagingPage />} />
        <Route path="/calendar" element={<ProjectCalendarPage />} />
        <Route path="/data-insight" element={<DataInsightPage />} />
        <Route path="/project/space" element={<ProjectSpacePage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
