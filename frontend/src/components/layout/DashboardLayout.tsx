// src/components/layout/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {/* মেইন কনটেন্ট এরিয়া - বাম পাশে 280px গ্যাপ রাখা হচ্ছে Sidebar এর জন্য */}
            <main style={{ flex: 1, marginLeft: '280px', padding: '2rem', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
                <Outlet />
            </main>
        </div>
    );
}