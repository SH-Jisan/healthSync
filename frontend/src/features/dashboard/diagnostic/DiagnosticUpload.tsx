import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import {
    MagnifyingGlass,
    UploadSimple,
    User,
} from 'phosphor-react';
//import { useTranslation } from 'react-i18next';
import styles from './DiagnosticUpload.module.css';

interface SimplePatient {
    id: string;
    full_name: string;
    phone?: string;
    email?: string;
}

export default function DiagnosticUpload() {
    //const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [patient, setPatient] = useState<SimplePatient | null>(null);
    const [reportTitle, setReportTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const searchPatient = async () => {
        if (!searchQuery) return;
        const { data } = await supabase
            .from('profiles')
            .select('id, full_name, phone, email')
            .or(`email.eq.${searchQuery},phone.eq.${searchQuery}`)
            .single();

        if (data) setPatient(data);
        else alert('Patient not found!');
    };

    const handleUpload = async () => {
        if (!patient || !file || !reportTitle) return alert('Please fill all fields');
        setUploading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser(); // Diagnostic User

            // 1. Upload File (Assuming 'medical-reports' bucket exists)
            const fileName = `${patient.id}/${Date.now()}_${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from('medical-reports')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Create DB Entry
            const { error: dbError } = await supabase.from('medical_events').insert({
                patient_id: patient.id,
                uploader_id: user?.id,
                event_type: 'LAB_REPORT',
                title: reportTitle,
                event_date: new Date().toISOString(),
                attachments: [fileName],
                summary: `Uploaded by Diagnostic Center`
            });

            if (dbError) throw dbError;

            alert('Report uploaded successfully!');
            setPatient(null);
            setFile(null);
            setReportTitle('');
            setSearchQuery('');

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            alert('Upload failed: ' + message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Upload Patient Report</h2>

            {/* Search Section */}
            <div className={styles.searchSection}>
                <input
                    placeholder="Patient Email or Phone"
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                />
                <button
                    onClick={searchPatient}
                    className={styles.searchBtn}
                >
                    <MagnifyingGlass size={20} />
                </button>
            </div>

            {/* Upload Form (Visible if patient found) */}
            {patient && (
                <div className={styles.uploadForm}>
                    <div className={styles.patientInfo}>
                        <div className={styles.patientAvatar}><User size={24} /></div>
                        <div>
                            <h3 className={styles.patientName}>{patient.full_name}</h3>
                            <small className={styles.patientContact}>{patient.phone || patient.email}</small>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Report Title</label>
                        <input
                            placeholder="e.g. Blood Test Result"
                            value={reportTitle} onChange={e => setReportTitle(e.target.value)}
                            className={styles.titleInput}
                        />
                    </div>

                    <div className={styles.fileGroup}>
                        <label className={styles.label}>Select File (PDF/Image)</label>
                        <input
                            type="file" accept="image/*,.pdf"
                            onChange={e => setFile(e.target.files?.[0] || null)}
                            className={styles.fileInput}
                        />
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className={styles.uploadBtn}
                    >
                        {uploading ? 'Uploading...' : <><UploadSimple size={20} /> Upload & Send</>}
                    </button>
                </div>
            )}
        </div>
    );
}