import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPageRouter } from './components/LandingPageRouter';
import { CourseCatalog } from './components/academy/CourseCatalog';
import { CourseDetail } from './components/academy/CourseDetail';
import { LessonPlayer } from './components/academy/LessonPlayer';
import { QuizPlayer } from './components/quiz/QuizPlayer';
import { TermsLibrary } from './components/reference/TermsLibrary';
import { MedicalTerminology } from './components/reference/MedicalTerminology';
import { SOPLibrary } from './components/reference/SOPLibrary';
import { SOPDetailPage } from './components/reference/SOPDetailPage';
import { SearchPage } from './components/reference/SearchPage';
import { InsuranceTermMatch } from './components/learning/InsuranceTermMatch';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminRoute } from './components/admin/AdminRoute';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { OrgAdminDashboard } from './components/admin/OrgAdminDashboard';
import { CreateOrganization } from './components/admin/CreateOrganization';
import { JoinOrganization } from './components/join/JoinOrganization';
import { FoundationsSection } from './components/sections/FoundationsSection';
import { InsuranceSection } from './components/sections/InsuranceSection';
import { TerminologySection } from './components/sections/TerminologySection';
import { WorkflowsSection } from './components/sections/WorkflowsSection';
import { InteractiveHub } from './components/interactive';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <LandingPageRouter />,
      },
      // New Section-based Navigation
      {
        path: 'foundations',
        element: <FoundationsSection />,
      },
      {
        path: 'foundations/:moduleSlug/:lessonSlug',
        element: <LessonPlayer />,
      },
      {
        path: 'foundations/:moduleSlug/quiz',
        element: <QuizPlayer />,
      },
      {
        path: 'insurance',
        element: <InsuranceSection />,
      },
      {
        path: 'insurance/:moduleSlug/:lessonSlug',
        element: <LessonPlayer />,
      },
      {
        path: 'insurance/:moduleSlug/quiz',
        element: <QuizPlayer />,
      },
      {
        path: 'terminology',
        element: <TerminologySection />,
      },
      {
        path: 'terminology/:moduleSlug/:lessonSlug',
        element: <LessonPlayer />,
      },
      {
        path: 'terminology/:moduleSlug/quiz',
        element: <QuizPlayer />,
      },
      {
        path: 'workflows',
        element: <WorkflowsSection />,
      },
      {
        path: 'workflows/lessons/:moduleSlug/:lessonSlug',
        element: <LessonPlayer />,
      },
      {
        path: 'workflows/lessons/:moduleSlug/quiz',
        element: <QuizPlayer />,
      },
      {
        path: 'workflows/sops',
        element: <SOPLibrary />,
      },
      {
        path: 'workflows/sops/:slug',
        element: <SOPDetailPage />,
      },
      // Interactive Practice
      {
        path: 'practice',
        element: <InteractiveHub />,
      },
      // Legacy routes (redirect to new structure)
      {
        path: 'courses',
        element: <CourseCatalog />,
      },
      {
        path: 'courses/:courseSlug',
        element: <CourseDetail />,
      },
      {
        path: 'courses/:courseSlug/:moduleSlug/:lessonSlug',
        element: <LessonPlayer />,
      },
      {
        path: 'courses/:courseSlug/:moduleSlug/quiz',
        element: <QuizPlayer />,
      },
      {
        path: 'terms',
        element: <TermsLibrary />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'exercises/insurance-matching',
        element: <InsuranceTermMatch />,
      },
      // Admin Routes
      {
        path: 'admin/login',
        element: <AdminLogin />,
      },
      {
        path: 'admin',
        element: <AdminRoute><SuperAdminDashboard /></AdminRoute>,
      },
      {
        path: 'admin/orgs/new',
        element: <AdminRoute><CreateOrganization /></AdminRoute>,
      },
      {
        path: 'admin/orgs/:orgSlug',
        element: <AdminRoute><OrgAdminDashboard /></AdminRoute>,
      },
      // Student Join Route
      {
        path: 'join/:code',
        element: <JoinOrganization />,
      },
    ],
  },
]);
