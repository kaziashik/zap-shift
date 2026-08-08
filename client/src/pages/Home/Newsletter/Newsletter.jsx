import React, { useState } from 'react';
import SectionHeader from '../../../components/ui/SectionHeader';
import Swal from 'sweetalert2';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Enter a valid email address.');
            return;
        }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 700));
        setLoading(false);
        setEmail('');
        Swal.fire({
            icon: 'success',
            title: 'Subscribed',
            text: 'You will receive ZapShift logistics updates.',
            timer: 1600,
            showConfirmButton: false
        });
    };

    return (
        <section className="py-16">
            <div className="zs-surface px-6 py-10 md:px-10">
                <SectionHeader
                    eyebrow="Newsletter"
                    title="Logistics tips in your inbox"
                    subtitle="Coverage updates, rider ops notes, and pricing changes — no spam."
                />
                <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row">
                    <div className="w-full">
                        <label htmlFor="newsletter-email" className="sr-only">Email</label>
                        <input
                            id="newsletter-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="zs-input"
                            placeholder="you@company.com"
                            required
                        />
                        {error && <p className="mt-1 text-sm text-error">{error}</p>}
                    </div>
                    <button type="submit" disabled={loading} className="zs-btn-primary shrink-0">
                        {loading ? <span className="loading loading-spinner loading-sm" /> : 'Subscribe'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Newsletter;
