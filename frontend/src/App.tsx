// src/App.tsx Update
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './features/dashboard/DashboardPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* পাবলিক রুট */}
                <Route path="/" element={<LoginPage />} />

                {/* প্রোটেক্টেড রুট (Sidebar সহ) */}
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    {/* ভবিষ্যতে এখানে /profile, /blood-bank ইত্যাদি আসবে */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
export default App;