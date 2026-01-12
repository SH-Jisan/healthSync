import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Plus, Trash, CurrencyDollar, Flask } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import styles from './DiagnosticTests.module.css';

interface Test {
    id: string;
    name: string;
    price: number;
}

export default function DiagnosticTests() {
    const { t } = useTranslation();
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState('');

    const fetchTests = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('available_tests')
            .select('*')
            .eq('center_id', user.id);

        if (data) setTests(data as Test[]);
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTests();
    }, []);

    const addTest = async () => {
        if (!newName || !newPrice) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase.from('available_tests').insert({
            center_id: user.id,
            name: newName,
            price: parseInt(newPrice)
        }).select();

        if (!error && data) {
            setTests([...tests, data[0] as Test]);
            setNewName('');
            setNewPrice('');
        }
    };

    const deleteTest = async (id: string) => {
        await supabase.from('available_tests').delete().eq('id', id);
        setTests(prev => prev.filter(t => t.id !== id));
    };

    if (loading) return <div>{t('common.loading')}</div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Manage Services / Tests</h2>

            {/* Add Form */}
            <div className={styles.addForm}>
                <input
                    placeholder="Test Name (e.g. CBC, MRI)"
                    value={newName} onChange={e => setNewName(e.target.value)}
                    className={styles.inputName}
                />
                <input
                    type="number"
                    placeholder="Price (BDT)"
                    value={newPrice} onChange={e => setNewPrice(e.target.value)}
                    className={styles.inputPrice}
                />
                <button
                    onClick={addTest}
                    className={styles.addBtn}
                >
                    <Plus size={20} /> Add
                </button>
            </div>

            {/* List */}
            <div className={styles.list}>
                {tests.map(test => (
                    <div key={test.id} className={styles.listItem}>
                        <div className={styles.itemInfo}>
                            <div className={styles.icon}>
                                <Flask size={24} />
                            </div>
                            <div className={styles.itemDetails}>
                                <h3>{test.name}</h3>
                                <div className={styles.itemPrice}>
                                    <CurrencyDollar size={18} /> {test.price} BDT
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => deleteTest(test.id)}
                            className={styles.deleteBtn}
                        >
                            <Trash size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}