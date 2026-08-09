import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaUserCheck } from 'react-icons/fa';
import { IoPersonRemoveSharp } from 'react-icons/io5';
import Swal from 'sweetalert2';
import usePagination from '../../../hooks/usePagination';
import StatusBadge from '../../../components/Dashboard/StatusBadge';
import Loading from '../../../components/Loading/Loading';

const ApproveRiders = () => {
    const axiosSecure = useAxiosSecure();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('pending');

    const { refetch, data: riders = [], isLoading } = useQuery({
        queryKey: ['riders', 'all'],
        queryFn: async () => {
            const res = await axiosSecure.get('/riders');
            return res.data;
        }
    });

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return riders.filter((rider) => {
            const matchesSearch = !q ||
                String(rider.name || '').toLowerCase().includes(q) ||
                String(rider.email || '').toLowerCase().includes(q) ||
                String(rider.district || '').toLowerCase().includes(q);
            const matchesStatus = statusFilter === 'all' || rider.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [riders, search, statusFilter]);

    const { page, totalPages, paginated, setPage, reset } = usePagination(filtered, 8);
    useEffect(() => { reset(); }, [search, statusFilter, reset]);

    const updateRiderStatus = (rider, status) => {
        axiosSecure.patch(`/riders/${rider._id}`, { status, email: rider.email })
            .then((res) => {
                if (res.data.modifiedCount) {
                    refetch();
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `Rider status → ${status}`,
                        showConfirmButton: false,
                        timer: 1600
                    });
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Update failed',
                    text: error?.response?.data?.message || error.message
                });
            });
    };

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/60">Riders</p>
                <h2 className="mt-1 text-3xl font-bold text-secondary dark:text-primary">Approve Riders</h2>
                <p className="mt-2 text-base-content/70">Showing: {filtered.length}</p>
            </div>

            <div className="zs-surface grid gap-3 p-4 md:grid-cols-3">
                <input
                    className="zs-input md:col-span-2"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, email, district"
                />
                <select className="select select-bordered rounded-xl" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="all">All</option>
                </select>
            </div>

            <div className="zs-table-wrap overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>District</th>
                            <th>Application</th>
                            <th>Work</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((rider, index) => (
                            <tr key={rider._id}>
                                <th>{(page - 1) * 8 + index + 1}</th>
                                <td className="font-semibold">{rider.name}</td>
                                <td>{rider.email}</td>
                                <td>{rider.district}</td>
                                <td><StatusBadge status={rider.status || 'pending'} /></td>
                                <td>{rider.workStatus || '—'}</td>
                                <td className="flex flex-wrap gap-2">
                                    <button type="button" onClick={() => updateRiderStatus(rider, 'approved')} className="btn btn-sm rounded-xl border-0 bg-primary text-secondary" title="Approve">
                                        <FaUserCheck />
                                    </button>
                                    <button type="button" onClick={() => updateRiderStatus(rider, 'rejected')} className="btn btn-sm rounded-xl" title="Reject">
                                        <IoPersonRemoveSharp />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!filtered.length && <p className="py-8 text-center text-base-content/60">No riders match this filter.</p>}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button type="button" className="btn btn-sm rounded-xl" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                    <span className="text-sm font-semibold">Page {page} of {totalPages}</span>
                    <button type="button" className="btn btn-sm rounded-xl" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
            )}
        </div>
    );
};

export default ApproveRiders;
