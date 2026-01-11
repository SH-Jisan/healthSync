import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { User, Phone, Briefcase, GraduationCap, CurrencyDollar, FloppyDisk } from 'phosphor-react';

export default function EditProfile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [role, setRole] = useState('CITIZEN');

    // Common Fields
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');

    // Doctor Specific Fields
    const [specialty, setSpecialty] = useState('');
    const [degree, setDegree] = useState('');
    const [experience, setExperience] = useState('');
    const [consultationFee, setConsultationFee] = useState('');
    const [about, setAbout] = useState('');

    const specialties = [
        'General Medicine', 'Cardiology', 'Neurology', 'Pediatrics',
        'Dermatology', 'Orthopedics', 'Gynecology', 'Dental', 'Eye Specialist'
    ];

    const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
            setRole(data.role || 'CITIZEN');
            setFullName(data.full_name || '');
            setPhone(data.phone || '');

            // Doctor fields
            if (data.role === 'DOCTOR') {
                setSpecialty(data.specialty || '');
                setDegree(data.degree || '');
                setExperience(data.experience || '');
                setConsultationFee(data.consultation_fee || '');
                setAbout(data.about || '');
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProfile();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const updates: any = {
            full_name: fullName,
            phone: phone,
            // district: address, // If you used district in donor profile, map address to district or add address column
            updated_at: new Date().toISOString(),
        };

        if (role === 'DOCTOR') {
            updates.specialty = specialty;
            updates.degree = degree;
            updates.experience = experience;
            updates.consultation_fee = consultationFee;
            updates.about = about;
        }

        const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);

        if (error) {
            alert('Error updating profile!');
        } else {
            alert('Profile updated successfully!');
            navigate('/profile');
        }
        setSaving(false);
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading...</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
            <h2 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>Edit Profile</h2>

            <form onSubmit={handleSave} style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)' }}>

                {/* Common Info */}
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    Basic Information
                </h3>

                <div style={formGroup}>
                    <label style={labelStyle}>Full Name</label>
                    <div style={inputWrapper}>
                        <User size={20} color="var(--text-secondary)" />
                        <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} />
                    </div>
                </div>

                <div style={formGroup}>
                    <label style={labelStyle}>Phone Number</label>
                    <div style={inputWrapper}>
                        <Phone size={20} color="var(--text-secondary)" />
                        <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
                    </div>
                </div>

                {/* Doctor Specific Info */}
                {role === 'DOCTOR' && (
                    <>
                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', margin: '2rem 0 1.5rem', color: 'var(--text-secondary)' }}>
                            Professional Details
                        </h3>

                        <div style={formGroup}>
                            <label style={labelStyle}>Specialty</label>
                            <div style={inputWrapper}>
                                <Briefcase size={20} color="var(--text-secondary)" />
                                <select value={specialty} onChange={e => setSpecialty(e.target.value)} style={{ ...inputStyle, background: 'transparent' }}>
                                    <option value="">Select Specialty</option>
                                    {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div style={formGroup}>
                            <label style={labelStyle}>Degrees (e.g. MBBS, FCPS)</label>
                            <div style={inputWrapper}>
                                <GraduationCap size={20} color="var(--text-secondary)" />
                                <input type="text" value={degree} onChange={e => setDegree(e.target.value)} style={inputStyle} placeholder="Degrees separated by comma" />
                            </div>
                        </div>

                        <div style={formGroup}>
                            <label style={labelStyle}>Experience (Years)</label>
                            <div style={inputWrapper}>
                                <input type="number" value={experience} onChange={e => setExperience(e.target.value)} style={inputStyle} placeholder="e.g. 5" />
                            </div>
                        </div>

                        <div style={formGroup}>
                            <label style={labelStyle}>Consultation Fee (BDT)</label>
                            <div style={inputWrapper}>
                                <CurrencyDollar size={20} color="var(--text-secondary)" />
                                <input type="number" value={consultationFee} onChange={e => setConsultationFee(e.target.value)} style={inputStyle} placeholder="e.g. 500" />
                            </div>
                        </div>

                        <div style={formGroup}>
                            <label style={labelStyle}>About / Bio</label>
                            <textarea
                                rows={3}
                                value={about} onChange={e => setAbout(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '5px' }}
                                placeholder="Write a short bio..."
                            />
                        </div>
                    </>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button
                        type="button"
                        onClick={() => navigate('/profile')}
                        style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--text-secondary)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        style={{ flex: 1, padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '8px' }}
                    >
                        {saving ? 'Saving...' : <><FloppyDisk size={20} /> Save Changes</>}
                    </button>
                </div>

            </form>
        </div>
    );
}

// Styles
const formGroup = { marginBottom: '1.2rem' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' };
const inputWrapper = {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc', background: 'white'
};
const inputStyle = { border: 'none', outline: 'none', width: '100%', fontSize: '1rem' };