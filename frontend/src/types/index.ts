// src/types/index.ts
export interface MedicalEvent {
    id: string;
    title: string;
    event_type: 'REPORT' | 'PRESCRIPTION' | 'VACCINATION'; // Enums from DB
    event_date: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    summary?: string;
    key_findings?: string[];
    attachment_urls?: string[];
    created_at: string;
    // ai_details?: any; // যদি লাগে
}