import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../../lib/supabaseClient';
import { CloudArrowUp, X, FileImage, Spinner, Warning } from 'phosphor-react';
import styles from './UploadModal.module.css';

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export default function UploadModal({ onClose, onSuccess }: Props) {
    const { t } = useTranslation();
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState('');
    const [isError, setIsError] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false); // New state for duplicate check

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
        setIsError(false);
        setIsDuplicate(false);
        setStatus('');
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
            'application/pdf': ['.pdf']
        },
        maxFiles: 1
    });

    // Helper: Convert File to Base64
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    };

    // Helper: Calculate SHA-256 Hash (Unique Fingerprint)
    const calculateFileHash = async (file: File): Promise<string> => {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setUploading(true);
        setIsError(false);
        setIsDuplicate(false);
        setStatus(t('upload.status_uploading'));

        try {
            const file = files[0];
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error(t('upload.error_no_user'));

            // 1. Calculate Hash FIRST (to send to backend)
            const fileHash = await calculateFileHash(file);

            // 2. Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('reports')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('reports')
                .getPublicUrl(fileName);

            // 3. Prepare Data
            setStatus(t('upload.status_analyzing'));
            const base64String = await convertToBase64(file);

            // 4. Call Edge Function with Hash
            const { error: funcError } = await supabase.functions.invoke('process-medical-report', {
                body: {
                    patient_id: user.id,
                    uploader_id: user.id,
                    imageBase64: base64String,
                    mimeType: file.type,
                    file_url: publicUrl,
                    file_path: fileName,
                    file_hash: fileHash // <--- CRITICAL: Sending Hash for Duplicate Check
                }
            });

            if (funcError) {
                // Check if it is a specific duplicate error (409 Conflict)
                // Note: supabase-js functions invoke error handling can be tricky.
                // Sometimes the error body contains the status or message.
                // Assuming standard error throwing or context checking:
                if (funcError.context?.response?.status === 409 || funcError.message?.includes('Duplicate')) {
                    setIsDuplicate(true);
                    throw new Error("This report has already been uploaded.");
                }
                throw funcError;
            }

            setStatus(t('upload.status_success'));
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1000);

        } catch (error: any) {
            console.error('Upload failed:', error);

            // Check for duplicate error specifically
            if (error.context?.response?.status === 409 || error.message?.includes('Duplicate')) {
                setIsDuplicate(true);
                setStatus("Duplicate File: This report already exists in your timeline.");
            } else {
                setIsError(true);
                setStatus(`${t('upload.error_fail')}: ${error.message}`);
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{t('upload.title')}</h3>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={24} />
                    </button>
                </div>

                <div
                    {...getRootProps()}
                    className={`${styles.dropzone} ${isDragActive ? styles.activeDropzone : ''}`}
                >
                    <input {...getInputProps()} />
                    <CloudArrowUp size={48} color="var(--primary)" />
                    <p className={styles.dropText}>{t('upload.drag_drop')}</p>
                    <small className={styles.supportText}>{t('upload.supports')}</small>
                </div>

                {files.length > 0 && (
                    <div className={styles.fileList}>
                        {files.map((file, idx) => (
                            <div key={idx} className={styles.fileItem}>
                                <div className={styles.fileInfo}>
                                    <FileImage size={20} />
                                    {file.name}
                                </div>
                                <button
                                    onClick={() => setFiles([])}
                                    className={styles.removeBtn}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {status && (
                    <div className={`${styles.status} ${isError ? styles.statusError : isDuplicate ? styles.statusWarning : styles.statusUploading}`}>
                        {isDuplicate && <Warning size={20} style={{marginRight: 5}} />}
                        {status}
                    </div>
                )}

                <button
                    className={styles.uploadBtn}
                    onClick={handleUpload}
                    disabled={files.length === 0 || uploading}
                >
                    {uploading ? (
                        <span className={styles.spinnerWrapper}>
                            <Spinner className={styles.spinner} size={20} />
                            {t('upload.processing')}
                        </span>
                    ) : (
                        t('upload.btn_analyze')
                    )}
                </button>
            </div>
        </div>
    );
}