import React from 'react';
import { Link } from 'react-router';
import { FiEdit3 } from 'react-icons/fi';
import { motion } from 'motion/react';

const ProfileCard = ({ user, role }) => {
    const photo = user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=03373D&color=CAEB66`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="zs-surface h-full rounded-2xl p-6"
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--zs-muted)]">Profile</p>
                    <h3 className="mt-1 text-2xl font-bold text-secondary">{user?.displayName || 'ZapShift User'}</h3>
                </div>
                <Link
                    to="/dashboard/settings"
                    className="btn btn-sm rounded-xl border-0 bg-primary text-secondary hover:bg-primary/80"
                >
                    <FiEdit3 /> Edit
                </Link>
            </div>

            <div className="mt-6 flex items-center gap-4">
                <img
                    src={photo}
                    alt={user?.displayName || 'User'}
                    className="size-20 rounded-2xl object-cover ring-4 ring-primary/40"
                />
                <div className="min-w-0">
                    <p className="truncate text-sm text-[var(--zs-muted)]">{user?.email}</p>
                    <span className="mt-2 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                        {role || 'user'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileCard;
