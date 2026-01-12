import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabaseClient.ts';
import { User } from 'phosphor-react';

export interface Patient {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    // Add other fields as needed based on what is fetched
}

interface Props {
    onSelectPatient: (patient: Patient) => void;
}

export default function DiagnosticPatients({ onSelectPatient }: Props) {
    const { t } = useTranslation();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('diagnostic_patients')
                .select('patient:patient_id(*)')
                .eq('diagnostic_id', user.id);

            if (data) setPatients(data.map((d) => d.patient) as unknown as Patient[]);
            setLoading(false);
        };
        fetchPatients();
    }, []);

    if (loading) return <div>{t('common.loading')}</div>;

    return (
        <div>
            {patients.length === 0 ? <p>{t('dashboard.diagnostic.patients.no_assigned')}</p> : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {patients.map(p => (
                        <div
                            key={p.id}
                            onClick={() => onSelectPatient(p)}
                            style={{
                                background: 'var(--surface)', padding: '1rem', borderRadius: '12px',
                                border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem'
                            }}
                        >
                            <div style={{ width: '40px', height: '40px', background: '#E0F2F1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} color="var(--primary)" />
                            </div>
                            <div>
                                <h4 style={{ margin: 0 }}>{p.full_name}</h4>
                                <small>{p.email}</small>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}