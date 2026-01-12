import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppWindow, Users, CalendarCheck, User } from 'phosphor-react';
import DoctorAppointments from './doctor/DoctorAppointments';
import DoctorMyPatients from './doctor/DoctorMyPatients';
import DoctorChambers from './doctor/DoctorChambers';

export default function DoctorHome() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'appointments' | 'patients' | 'chambers'>('appointments');

    return (
        <div>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(to right, #2563EB, #3B82F6)',
                padding: '2rem',
                borderRadius: '16px',
                color: 'white',
                marginBottom: '2rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
                <h1 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <User weight="bold" /> {t('dashboard.doctor.title', 'Doctor Dashboard')}
                </h1>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>
                    {t('dashboard.doctor.subtitle', 'Manage your appointments, patients, and chambers.')}
                </p>
            </div>

            {/* Navigation Tabs */}
            <div style={{
                display: 'flex',
                gap: '2rem',
                borderBottom: '1px solid var(--border)',
                marginBottom: '2rem',
                overflowX: 'auto'
            }}>
                <button
                    onClick={() => setActiveTab('appointments')}
                    style={getTabStyle(activeTab === 'appointments')}
                >
                    <CalendarCheck size={20} weight={activeTab === 'appointments' ? 'fill' : 'regular'} />
                    {t('dashboard.doctor.tabs.appointments', 'Appointments')}
                </button>
                <button
                    onClick={() => setActiveTab('patients')}
                    style={getTabStyle(activeTab === 'patients')}
                >
                    <Users size={20} weight={activeTab === 'patients' ? 'fill' : 'regular'} />
                    {t('dashboard.doctor.tabs.patients', 'My Patients')}
                </button>
                <button
                    onClick={() => setActiveTab('chambers')}
                    style={getTabStyle(activeTab === 'chambers')}
                >
                    <AppWindow size={20} weight={activeTab === 'chambers' ? 'fill' : 'regular'} />
                    {t('dashboard.doctor.tabs.chambers', 'Manage Chambers')}
                </button>
            </div>

            {/* Content Area */}
            <div style={{ minHeight: '500px' }}>
                {activeTab === 'appointments' && <DoctorAppointments />}
                {activeTab === 'patients' && <DoctorMyPatients />}
                {activeTab === 'chambers' && <DoctorChambers />}
            </div>
        </div>
    );
}

function getTabStyle(isActive: boolean) {
    return {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '1rem 0.5rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: isActive ? 600 : 500,
        color: isActive ? '#2563EB' : 'var(--text-secondary)',
        borderBottom: isActive ? '3px solid #2563EB' : '3px solid transparent',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap' as const,
    };
}