import { Routes, Route, Navigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { PATHS } from './paths';
import { lazy, Suspense } from 'react';

// Route Wrappers
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Layouts
import DashboardLayout from '../components/layout/DashboardLayout';

// Pages - Lazy Loaded
const LandingPage = lazy(() => import('../pages/CurrentLanding/LandingPage'));
const LoginPage = lazy(() => import('../features/auth/LoginPage'));
const SignupPage = lazy(() => import('../features/auth/SignupPage'));
const AboutPage = lazy(() => import('../features/about/AboutPage'));

// Feature Pages
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const ProfilePage = lazy(() => import('../features/profile/ProfilePage'));
const EditProfile = lazy(() => import('../features/profile/EditProfile'));
const PatientAppointments = lazy(() => import('../features/appointments/PatientAppointments'));
const NotificationsPage = lazy(() => import('../features/notifications/NotificationsPage'));
const PatientPrescriptions = lazy(() => import('../features/patient/PatientPrescriptions'));

// Blood Bank
const BloodHome = lazy(() => import('../features/blood/BloodHome'));
const RequestBlood = lazy(() => import('../features/blood/RequestBlood'));
const BloodFeed = lazy(() => import('../features/blood/BloodFeed'));
const DonorRegistration = lazy(() => import('../features/blood/DonorRegistration'));
const DonorSearch = lazy(() => import('../features/blood/DonorSearch'));
const MyBloodRequests = lazy(() => import('../features/blood/MyBloodRequests'));

// Doctor
const DoctorList = lazy(() => import('../features/doctor/DoctorList'));
const DoctorPatientProfile = lazy(() => import('../features/doctor/DoctorPatientProfile'));

interface AppRoutesProps {
    session: Session | null;
}

const LoadingFallback = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
    </div>
);

const AppRoutes = ({ session }: AppRoutesProps) => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Public-only routes (redirect to dashboard if logged in) */}
                <Route element={<PublicRoute session={session} />}>
                    <Route path={PATHS.LANDING} element={<LandingPage />} />
                    <Route path={PATHS.LOGIN} element={<LoginPage />} />
                    <Route path={PATHS.SIGNUP} element={<SignupPage />} />
                </Route>

                {/* Public routes (always accessible) */}
                <Route path={PATHS.ABOUT} element={<AboutPage />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute session={session} />}>
                    <Route element={<DashboardLayout />}>
                        <Route path={PATHS.DASHBOARD} element={<DashboardPage />} />
                        <Route path={PATHS.PATIENT_DETAILS} element={<DoctorPatientProfile />} />
                        <Route path={PATHS.PROFILE} element={<ProfilePage />} />
                        <Route path={PATHS.PROFILE_EDIT} element={<EditProfile />} />
                        <Route path={PATHS.APPOINTMENTS} element={<PatientAppointments />} />
                        <Route path={PATHS.PRESCRIPTIONS} element={<PatientPrescriptions />} />
                        <Route path={PATHS.NOTIFICATIONS} element={<NotificationsPage />} />

                        {/* Blood Bank */}
                        <Route path={PATHS.BLOOD_HOME} element={<BloodHome />} />
                        <Route path={PATHS.BLOOD_REQUEST} element={<RequestBlood />} />
                        <Route path={PATHS.BLOOD_FEED} element={<BloodFeed />} />
                        <Route path={PATHS.BLOOD_REGISTER} element={<DonorRegistration />} />
                        <Route path={PATHS.BLOOD_SEARCH} element={<DonorSearch />} />
                        <Route path={PATHS.BLOOD_MY_REQUESTS} element={<MyBloodRequests />} />

                        {/* Doctor */}
                        <Route path={PATHS.DOCTORS} element={<DoctorList />} />
                    </Route>
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to={session ? PATHS.DASHBOARD : PATHS.LANDING} replace />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
