import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
import ExternalRedirect from "./ExternalRedirect";

import MainLayout from "../layouts/MainLayout";
import { isRouteDisabled } from "../config/disabledRoutes";

const HomePage = lazy(() => import("../pages/HomePage"));
const TemplateGalleryPage = lazy(() => import("../pages/TemplateGalleryPage"));
const CoverLetterGalleryPage = lazy(
  () => import("../pages/CoverLetterGalleryPage"),
);
const AiPage = lazy(() => import("../pages/AiPage"));
const PublicResumePage = lazy(() => import("../pages/PublicResumePage"));

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const MyResumePage = lazy(() => import("../pages/MyResumePage"));
const AnalyticsPage = lazy(() => import("../pages/AnalyticsPage"));
const Settings = lazy(() => import("../pages/SettingsPage"));
const ResumeEditorPage = lazy(() => import("../pages/resume/ResumeEditorPage"));
const CoverLetterEditorPage = lazy(
  () => import("../pages/coverLetter/CoverLetterEditorPage"),
);

const AdminDashboardPage = lazy(
  () => import("../pages/admin/AdminDashboardPage"),
);
const UsersPage = lazy(() => import("../pages/admin/UsersPage"));
const BookingRequestsPage = lazy(
  () => import("../pages/admin/BookingRequestsPage"),
);
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const InterviewPage = lazy(() => import("../pages/InterviewPage"));
const GenerateInterviewPage = lazy(
  () => import("../pages/interview/GenerateInterviewPage"),
);
const InterviewSessionPage = lazy(
  () => import("../pages/interview/InterviewSessionPage"),
);
const InterviewHistoryPage = lazy(
  () => import("../pages/interview/InterviewHistoryPage"),
);
const BookSessionPage = lazy(
  () => import("../pages/interview/BookSessionPage"),
);

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-btn" />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ============ AUTH LIVES IN THRONE8: old URLs just forward there ============ */}

        <Route path="/login" element={<ExternalRedirect to="login" />} />

        <Route path="/register" element={<ExternalRedirect to="signup" />} />

        <Route path="/resume/public/:shareId" element={<PublicResumePage />} />

        {/* ================= PUBLIC + LAYOUT ================= */}

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/home" element={<HomePage />} />

          <Route path="/templates" element={<TemplateGalleryPage />} />

          <Route path="/cover-letters" element={<CoverLetterGalleryPage />} />

          {!isRouteDisabled("/ai") && (
            <Route path="/ai" element={<AiPage />} />
          )}
        </Route>

        {/* ================= AUTHENTICATED USER ================= */}

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/myresume" element={<MyResumePage />} />

          {!isRouteDisabled("/analytics") && (
            <Route path="/analytics" element={<AnalyticsPage />} />
          )}

          {!isRouteDisabled("/settings") && (
            <Route path="/settings" element={<Settings />} />
          )}
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/interview/ai" element={<GenerateInterviewPage />} />
          <Route
            path="/interview/ai/session/:sessionId"
            element={<InterviewSessionPage />}
          />
          <Route path="/interview/book" element={<BookSessionPage />} />
          <Route path="/interview/history" element={<InterviewHistoryPage />} />

          <Route path="/resume/:id/edit" element={<ResumeEditorPage />} />

          <Route
            path="/cover-letter/:id/edit"
            element={<CoverLetterEditorPage />}
          />
        </Route>

        {/* ================= ADMIN ================= */}

        <Route
          element={
            <AdminProtectedRoute>
              <MainLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboardPage />} />

          <Route path="/admin/users" element={<UsersPage />} />

          <Route path="/admin/bookings" element={<BookingRequestsPage />} />
        </Route>
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
