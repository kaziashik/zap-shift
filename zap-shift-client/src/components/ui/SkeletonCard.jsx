import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="zs-card flex h-full flex-col animate-pulse">
            <div className="h-40 rounded-xl bg-base-300" />
            <div className="mt-4 h-5 w-2/3 rounded bg-base-300" />
            <div className="mt-3 h-4 w-full rounded bg-base-300" />
            <div className="mt-2 h-4 w-4/5 rounded bg-base-300" />
            <div className="mt-auto flex gap-2 pt-5">
                <div className="h-6 w-16 rounded-full bg-base-300" />
                <div className="h-6 w-20 rounded-full bg-base-300" />
            </div>
            <div className="mt-4 h-10 w-full rounded-xl bg-base-300" />
        </div>
    );
};

export default SkeletonCard;
