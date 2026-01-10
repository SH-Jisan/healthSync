import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient.ts';
import { Buildings, Plus, Trash, Clock } from 'phosphor-react';

interface Hospital {
    id: string;
    hospital_name: string;
    visiting_hours: string;
}

export default function DoctorChambers() {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form
    const [name, setName] = useState('');
    const [hours, setHours] = useState('');

    const fetchHospitals = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('doctor_hospitals')
            .select('*')
            .eq('doctor_id', user.id);

        if (data) setHospitals(data as Hospital[]);
        setLoading(false);
    };

    useEffect(() => {
        fetchHospitals();
    }, []);

    const addHospital = async () => {
        if (!name || !hours) return alert('Please fill all fields');

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('doctor_hospitals').insert({
            doctor_id: user.id,
            hospital_name: name,
            visiting_hours: hours
        });

        if (error) {
            alert('Error adding hospital');
        } else {
            setShowModal(false);
            setName('');
            setHours('');
            fetchHospitals();
        }
    };

    const deleteHospital = async (id: string) => {
        if (!confirm('Delete this chamber?')) return;
        await supabase.from('doctor_hospitals').delete().eq('id', id);
        setHospitals(prev => prev.filter(h => h.id !== id));
    };

    if (loading) return <div>Loading Chambers...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ color: 'var(--primary)', margin: 0 }}>My Chambers</h2>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary)',
                        color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                    }}
                >
                    <Plus size={20} /> Add Chamber
                </button>
            </div>

            {hospitals.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
                    No chambers added yet.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {hospitals.map(h => (
                        <div key={h.id} style={{
                            background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px',
                            border: '1px solid var(--border)', position: 'relative'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <Buildings size={24} color="var(--primary)" />
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{h.hospital_name}</h3>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                <Clock size={16} />
                                {h.visiting_hours}
                            </div>

                            <button
                                onClick={() => deleteHospital(h.id)}
                                style={{
                                    position: 'absolute', top: '15px', right: '15px', background: '#FEE2E2',
                                    color: '#DC2626', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer'
                                }}
                            >
                                <Trash size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '400px' }}>
                        <h3>Add New Chamber</h3>
                        <input
                            placeholder="Hospital / Chamber Name"
                            value={name} onChange={e => setName(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                        <input
                            placeholder="Visiting Hours (e.g. 5PM - 9PM)"
                            value={hours} onChange={e => setHours(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={addHospital} style={{ flex: 1, padding: '10px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}