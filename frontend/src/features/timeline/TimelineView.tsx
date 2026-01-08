/* eslint-disable */
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { MedicalEvent } from '../../types';
import TimelineTile from './TimelineTile';

export default function TimelineView() {
    const [events, setEvents] = useState<MedicalEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        //
        const { data, error } = await supabase
            .from('medical_events')
            .select('*')
            .eq('patient_id', user.id)
            .order('event_date', { ascending: false });

        if (error) {
            console.error('Error fetching timeline:', error);
        } else {
            setEvents(data || []);
        }
        setLoading(false);
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading timeline...</div>;

    if (events.length === 0) {
        return (
            <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-secondary)' }}>
                <h3>No Medical Records Found</h3>
                <p>Upload your first report to start tracking.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--primary)' }}>My Medical History</h2>

            {events.map((event, index) => (
                <TimelineTile
                    key={event.id}
                    event={event}
                    isLast={index === events.length - 1}
                />
            ))}
        </div>
    );
}