import React from 'react';

const StatusBadge = ({ status }) => {
    const key = String(status || 'pending').toLowerCase().replace(/\s+/g, '-');
    const label = String(status || 'pending').replaceAll('_', ' ');

    return (
        <span className={`zs-badge zs-badge-${key}`}>
            <span className="size-1.5 rounded-full bg-current opacity-70" />
            {label}
        </span>
    );
};

export default StatusBadge;
