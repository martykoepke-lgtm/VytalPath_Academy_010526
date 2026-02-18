import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './components/LandingPage';
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
import { OrgAdminRoute } from './components/admin/OrgAdminRoute';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { OrgAdminDashboard } from './components/admin/OrgAdminDashboard';
import { CreateOrganization } from './components/admin/CreateOrganization';
import { AdminRedirect } from './components/admin/AdminRedirect';
import { JoinOrganization } from './components/join/JoinOrganization';
import { ResetPassword } from './components/auth/ResetPassword';
import { FoundationsSection } from './components/sections/FoundationsSection';
import { MedicalLawEthicsSection } from './components/sections/MedicalLawEthicsSection';
import { InsuranceSection } from './components/sections/InsuranceSection';
import { TerminologySection } from './components/sections/TerminologySection';
import { WorkflowsSection } from './components/sections/WorkflowsSection';
import { EHRSection } from './components/sections/EHRSection';
import { CommunicationSection } from './components/sections/CommunicationSection';
import { InteractiveHub } from './components/interactive';
import { PhoneCallSimulator } from './components/practice/PhoneCallSimulator';
import { DayInTheLife } from './components/practice/DayInTheLife';
import { InsuranceHotline } from './components/practice/InsuranceHotline';
import { ReadinessAssessment } from './components/practice/ReadinessAssessment';
import { AuthRoute } from './components/auth/AuthRoute';
import { AuthOnlyRoute } from './components/auth/AuthOnlyRoute';
import { AccountPage } from './components/account/AccountPage';
import { PricingPage } from './components/billing/PricingPage';
import { CurriculumPage } from './pages/CurriculumPage';
import { ProgramIntro } from './components/ProgramIntro';
import { AiStudyGuide } from './components/AiStudyGuide';
import { CMAADashboard } from './components/progress/CMAADashboard';
import { EHRPracticeLab } from './components/ehr-lab/EHRPracticeLab';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsOfService } from './components/legal/TermsOfService';
import { CookiePolicy } from './components/legal/CookiePolicy';
import { AcceptableUsePolicy } from './components/legal/AcceptableUsePolicy';
import { ReturnsPolicy } from './components/legal/ReturnsPolicy';
import { SkillsGuide } from './components/SkillsGuide';
import { NotFound } from './components/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      // Public Pages
      {
        path: 'pricing',
        element: <PricingPage />,
      },
      {
        path: 'curriculum',
        element: <CurriculumPage />,
      },
      // Legal Pages (public, no auth required)
      {
        path: 'privacy',
        element: <PrivacyPolicy />,
      },
      {
        path: 'terms-of-service',
        element: <TermsOfService />,
      },
      {
        path: 'cookies',
        element: <CookiePolicy />,
      },
      {
        path: 'acceptable-use',
        element: <AcceptableUsePolicy />,
      },
      {
        path: 'returns',
        element: <ReturnsPolicy />,
      },
      // Skills Guide (public lead generation page)
      {
        path: 'skills',
        element: <SkillsGuide />,
      },
      // Program Introduction - Entry point for new users
      {
        path: 'welcome',
        element: <AuthRoute><ProgramIntro /></AuthRoute>,
      },
      // AI Study Guide
      {
        path: 'ai-guide',
        element: <AuthRoute><AiStudyGuide /></AuthRoute>,
      },
      // Protected Learning Content - Requires Authentication
      {
        path: 'foundations',
        element: <AuthRoute><FoundationsSection /></AuthRoute>,
      },
      {
        path: 'foundations/:moduleSlug/:lessonSlug',
        element: <AuthRoute><LessonPlayer /></AuthRoute>,
      },
      {
        path: 'foundations/:moduleSlug/quiz',
        element: <AuthRoute><QuizPlayer /></AuthRoute>,
      },
      {
        path: 'medical-law-ethics',
        element: <AuthRoute><MedicalLawEthicsSection /></AuthRoute>,
      },
      {
        path: 'medical-law-ethics/:moduleSlug/:lessonSlug',
        element: <AuthRoute><LessonPlayer /></AuthRoute>,
      },
      {
        path: 'medical-law-ethics/:moduleSlug/quiz',
        element: <AuthRoute><QuizPlayer /></AuthRoute>,
      },
      {
        path: 'insurance',
        element: <AuthRoute><InsuranceSection /></AuthRoute>,
      },
      {
        path: 'insurance/:moduleSlug/:lessonSlug',
        element: <AuthRoute><LessonPlayer /></AuthRoute>,
      },
      {
        path: 'insurance/:moduleSlug/quiz',
        element: <AuthRoute><QuizPlayer /></AuthRoute>,
      },
      {
        path: 'terminology',
        element: <AuthRoute><TerminologySection /></AuthRoute>,
      },
      {
        path: 'terminology/:moduleSlug/:lessonSlug',
        element: <AuthRoute><LessonPlayer /></AuthRoute>,
      },
      {
        path: 'terminology/:moduleSlug/quiz',
        element: <AuthRoute><QuizPlayer /></AuthRoute>,
      },
      {
        path: 'workflows',
        element: <AuthRoute><WorkflowsSection /></AuthRoute>,
      },
      {
        path: 'workflows/lessons/:moduleSlug/:lessonSlug',
        element: <AuthRoute><LessonPlayer /></AuthRoute>,
      },
      {
        path: 'workflows/lessons/:moduleSlug/quiz',
        element: <AuthRoute><QuizPlayer /></AuthRoute>,
      },
      {
        path: 'workflows/sops',
        element: <AuthRoute><SOPLibrary /></AuthRoute>,
      },
      {
        path: 'workflows/sops/:slug',
        element: <AuthRoute><SOPDetailPage /></AuthRoute>,
      },
      // Patient Communication Section
      {
        path: 'communication',
        element: <AuthRoute><CommunicationSection /></AuthRoute>,
      },
      {
        path: 'communication/:moduleSlug/:lessonSlug',
        element: <AuthRoute><LessonPlayer /></AuthRoute>,
      },
      {
        path: 'communication/:moduleSlug/quiz',
        element: <AuthRoute><QuizPlayer /></AuthRoute>,
      },
      // EHR & Practice Management Section
      {
        path: 'ehr-fundamentals',
        element: <AuthRoute><EHRSection /></AuthRoute>,
      },
      {
        path: 'ehr-fundamentals/:moduleSlug/:lessonSlug',
        element: <AuthRoute><LessonPlayer /></AuthRoute>,
      },
      {
        path: 'ehr-fundamentals/:moduleSlug/quiz',
        element: <AuthRoute><QuizPlayer /></AuthRoute>,
      },
      // EHR Practice Lab
      {
        path: 'ehr-lab',
        element: <AuthRoute><EHRPracticeLab /></AuthRoute>,
      },
      // My Progress Dashboard
      {
        path: 'progress',
        element: <AuthRoute><CMAADashboard /></AuthRoute>,
      },
      // Account (auth only, no subscription check)
      {
        path: 'account',
        element: <AuthOnlyRoute><AccountPage /></AuthOnlyRoute>,
      },
      // Interactive Practice
      {
        path: 'practice',
        element: <AuthRoute><InteractiveHub /></AuthRoute>,
      },
      {
        path: 'practice/phone-simulator',
        element: <AuthRoute><PhoneCallSimulator /></AuthRoute>,
      },
      {
        path: 'practice/day-in-the-life',
        element: <AuthRoute><DayInTheLife /></AuthRoute>,
      },
      {
        path: 'practice/insurance-hotline',
        element: <AuthRoute><InsuranceHotline /></AuthRoute>,
      },
      {
        path: 'practice/readiness',
        element: <AuthRoute><ReadinessAssessment /></AuthRoute>,
      },
      // Legacy routes (protected)
      {
        path: 'courses',
        element: <AuthRoute><CourseCatalog /></AuthRoute>,
      },
      {
        path: 'courses/:courseSlug',
        element: <AuthRoute><CourseDetail /></AuthRoute>,
      },
      {
        path: 'courses/:courseSlug/:moduleSlug/:lessonSlug',
        element: <AuthRoute><LessonPlayer /></AuthRoute>,
      },
      {
        path: 'courses/:courseSlug/:moduleSlug/quiz',
        element: <AuthRoute><QuizPlayer /></AuthRoute>,
      },
      {
        path: 'terms',
        element: <AuthRoute><TermsLibrary /></AuthRoute>,
      },
      {
        path: 'search',
        element: <AuthRoute><SearchPage /></AuthRoute>,
      },
      {
        path: 'exercises/insurance-matching',
        element: <AuthRoute><InsuranceTermMatch /></AuthRoute>,
      },
      // Admin Routes
      {
        path: 'admin/login',
        element: <AdminLogin />,
      },
      {
        path: 'admin/redirect',
        element: <AdminRedirect />,
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
        element: <OrgAdminRoute><OrgAdminDashboard /></OrgAdminRoute>,
      },
      // Student Join Route
      {
        path: 'join/:code',
        element: <JoinOrganization />,
      },
      // Password Reset Route
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      // 404 catch-all — must be last
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
