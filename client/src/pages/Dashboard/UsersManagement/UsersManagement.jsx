import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaUserShield } from 'react-icons/fa';
import { FiShieldOff } from 'react-icons/fi';
import Swal from 'sweetalert2';
import usePagination from '../../../hooks/usePagination';
import StatusBadge from '../../../components/Dashboard/StatusBadge';

const UsersManagement = () => {
    const axiosSecure = useAxiosSecure();
    const [searchText, setSearchText] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const { refetch, data: users = [], isLoading } = useQuery({
        queryKey: ['users', searchText],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users?searchText=${searchText}`);
            return res.data;
        }
    });

    const filtered = useMemo(() => {
        if (roleFilter === 'all') return users;
        return users.filter((user) => (user.role || 'user') === roleFilter);
    }, [users, roleFilter]);

    const { page, totalPages, paginated, setPage } = usePagination(filtered, 8);

    const confirmRoleChange = async (user, role) => {
        const result = await Swal.fire({
            title: role === 'admin' ? 'Make admin?' : 'Remove admin?',
            text: `${user.displayName || user.email} will become ${role}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#03373D',
            confirmButtonText: 'Confirm'
        });
        if (!result.isConfirmed) return;

        const res = await axiosSecure.patch(`/users/${user._id}/role`, { role });
        if (res.data.modifiedCount) {
            refetch();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `${user.displayName || user.email} is now ${role}`,
                showConfirmButton: false,
                timer: 1800
            });
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/60">Admin</p>
                <h2 className="mt-1 text-3xl font-bold text-secondary dark:text-primary">Manage Users</h2>
                <p className="mt-2 text-base-content/70">Total users: {filtered.length}</p>
            </div>

            <div className="zs-surface grid gap-3 p-4 md:grid-cols-3">
                <label className="form-control md:col-span-2">
                    <span className="mb-1 text-sm font-medium">Search by email / name</span>
                    <input
                        onChange={(e) => setSearchText(e.target.value)}
                        type="search"
                        className="zs-input"
                        placeholder="Search users"
                    />
                </label>
                <label className="form-control">
                    <span className="mb-1 text-sm font-medium">Filter by role</span>
                    <select className="select select-bordered rounded-xl" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                        <option value="all">All roles</option>
                        <option value="user">User</option>
                        <option value="rider">Rider</option>
                        <option value="admin">Admin</option>
                    </select>
                </label>
            </div>

            <div className="zs-table-wrap">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{(page - 1) * 8 + index + 1}</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <img
                                                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}`}
                                                        alt={user.displayName || 'User'}
                                                    />
                                                </div>
                                            </div>
                                            <div className="font-bold">{user.displayName || 'Unnamed user'}</div>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td><StatusBadge status={user.role || 'user'} /></td>
                                    <td>
                                        {user.role === 'admin' ? (
                                            <button
                                                type="button"
                                                onClick={() => confirmRoleChange(user, 'user')}
                                                className="btn btn-sm rounded-xl bg-red-200 text-red-900"
                                            >
                                                <FiShieldOff /> Make User
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => confirmRoleChange(user, 'admin')}
                                                className="btn btn-sm rounded-xl bg-primary text-secondary"
                                            >
                                                <FaUserShield /> Make Admin
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!isLoading && !paginated.length && (
                        <p className="py-10 text-center text-base-content/60">No users found.</p>
                    )}
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button type="button" className="btn btn-sm rounded-xl" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                    <span className="text-sm font-semibold">Page {page} / {totalPages}</span>
                    <button type="button" className="btn btn-sm rounded-xl" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;
