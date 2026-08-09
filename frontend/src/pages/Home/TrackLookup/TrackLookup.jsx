import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import { FaMapMarkedAlt, FaSearchLocation, FaShippingFast } from 'react-icons/fa';

const TrackLookup = () => {
    const navigate = useNavigate();
    const reduceMotion = useReducedMotion();
    const [trackingId, setTrackingId] = useState('');
    const [error, setError] = useState('');

    const handleTrack = (e) => {
        e.preventDefault();
        const id = trackingId.trim();
        if (!id) {
            setError('Enter your tracking ID.');
            return;
        }
        if (id.length < 4) {
            setError('Tracking ID looks too short.');
            return;
        }
        setError('');
        navigate(`/parcel-track/${encodeURIComponent(id)}`);
    };

    return (
        <section className="w-full py-10 md:py-14">
            <div className="px-2 sm:px-3 md:px-4">
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-2xl bg-secondary px-5 py-10 text-white sm:rounded-3xl md:px-10 md:py-12 lg:px-14"
                >
                    <span
                        className="pointer-events-none absolute -right-4 top-2 select-none text-[7rem] font-extrabold leading-none text-primary/15 md:text-[9rem]"
                        aria-hidden="true"
                    >
                        ID
                    </span>
                    <div
                        className="pointer-events-none absolute -left-16 bottom-0 size-56 rounded-full bg-primary/10 blur-3xl"
                        aria-hidden="true"
                    />

                    <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/90">
                                Live tracking
                            </p>
                            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                                Track your parcel in seconds
                            </h2>
                            <p className="mt-3 max-w-xl text-white/75">
                                Paste your tracking ID (from My Parcels after booking) to open the full status timeline —
                                created, paid, pickup, transit, and delivered.
                            </p>

                            <form onSubmit={handleTrack} className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row">
                                <div className="w-full">
                                    <label htmlFor="home-tracking-id" className="sr-only">Tracking ID</label>
                                    <input
                                        id="home-tracking-id"
                                        type="text"
                                        value={trackingId}
                                        onChange={(e) => {
                                            setTrackingId(e.target.value);
                                            if (error) setError('');
                                        }}
                                        className="zs-input border-0 bg-white text-secondary placeholder:text-secondary/45"
                                        placeholder="PRCL-20260722-ABAECA"
                                        autoComplete="off"
                                    />
                                    {error && <p className="mt-1.5 text-sm font-medium text-primary">{error}</p>}
                                </div>
                                <button type="submit" className="zs-btn-primary shrink-0 sm:min-w-[9rem]">
                                    Track now
                                </button>
                            </form>
                            <p className="mt-2 text-xs text-white/55">
                                Tip: copy the ID from Dashboard → My Parcels after you create a booking.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                            <Link
                                to="/send-parcel"
                                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10"
                            >
                                <span className="grid size-10 place-items-center rounded-xl bg-primary text-secondary">
                                    <FaShippingFast />
                                </span>
                                <span>
                                    <span className="block text-sm font-bold">Send a parcel</span>
                                    <span className="text-xs text-white/65">Book pickup in minutes</span>
                                </span>
                            </Link>
                            <Link
                                to="/coverage"
                                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10"
                            >
                                <span className="grid size-10 place-items-center rounded-xl bg-primary text-secondary">
                                    <FaMapMarkedAlt />
                                </span>
                                <span>
                                    <span className="block text-sm font-bold">Check coverage</span>
                                    <span className="text-xs text-white/65">64 districts nationwide</span>
                                </span>
                            </Link>
                            <Link
                                to="/explore"
                                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10"
                            >
                                <span className="grid size-10 place-items-center rounded-xl bg-primary text-secondary">
                                    <FaSearchLocation />
                                </span>
                                <span>
                                    <span className="block text-sm font-bold">Browse services</span>
                                    <span className="text-xs text-white/65">Same city to inter-district</span>
                                </span>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TrackLookup;
