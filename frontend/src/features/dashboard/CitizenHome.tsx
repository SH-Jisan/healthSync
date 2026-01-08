// src/features/dashboard/CitizenHome.tsx
import { useState } from 'react';
import TimelineView from '../timeline/TimelineView';
import HealthPlanView from '../health-plan/HealthPlanView';
import { FileText, Heartbeat } from 'phosphor-react'; // Icons

export default function CitizenHome() {
    const [activeTab, setActiveTab] = useState<'timeline' | 'plan'>('timeline');

    return (
        <div>
            {/* Tab Navigation */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '1px'
            }}>
                <button
                    onClick={() => setActiveTab('timeline')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 20px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'timeline' ? '3px solid var(--primary)' : '3px solid transparent',
                        color: activeTab === 'timeline' ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: activeTab === 'timeline' ? '600' : '500',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    <FileText size={20} />
                    Medical History
                </button>

                <button
                    onClick={() => setActiveTab('plan')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 20px',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'plan' ? '3px solid var(--primary)' : '3px solid transparent',
                        color: activeTab === 'plan' ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: activeTab === 'plan' ? '600' : '500',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    <Heartbeat size={20} />
                    Health Plan
                </button>
            </div>

            {/* Tab Content */}
            <div style={{ minHeight: '400px' }}>
                {activeTab === 'timeline' ? <TimelineView /> : <HealthPlanView />}
            </div>
        </div>
    );
}