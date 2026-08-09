import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { updatePassword } from 'firebase/auth';
import { motion } from 'motion/react';

const Settings = () => {
    const { user, updateUserProfile } = useAuth();
    const { role } = useRole();
    const axiosSecure = useAxiosSecure();
    const [name, setName] = useState(user?.displayName || '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
    const [password, setPassword] = useState('');
    const [saving, setSaving] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (name.trim().length < 2) {
            Swal.fire({ icon: 'error', title: 'Name required', text: 'Enter at least 2 characters.' });
            return;
        }
        setSaving(true);
        try {
            await updateUserProfile({
                displayName: name.trim(),
                photoURL: photoURL.trim()
            });

            await axiosSecure.patch('/users/profile', {
                displayName: name.trim(),
                photoURL: photoURL.trim()
            });

            if (password.trim().length >= 6) {
                await updatePassword(user, password.trim());
            }

            Swal.fire({
                icon: 'success',
                title: 'Profile updated',
                text: 'Your ZapShift profile has been saved.',
                timer: 1600,
                showConfirmButton: false
            });
            setPassword('');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update failed',
                text: error?.response?.data?.message || error.message || 'Please re-login and try again.'
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="animate-fade-up">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--zs-muted)]">Account</p>
                <h2 className="mt-1 text-3xl font-bold text-secondary">User Settings</h2>
                <p className="mt-2 text-[var(--zs-muted)]">Update your image, name, and password.</p>
            </div>

            <motion.form
                onSubmit={handleProfileUpdate}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="zs-surface space-y-5 rounded-2xl p-6"
            >
                <div className="flex items-center gap-4">
                    <img
                        src={photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=03373D&color=CAEB66`}
                        alt="Preview"
                        className="size-20 rounded-2xl object-cover ring-4 ring-primary/40"
                    />
                    <div>
                        <p className="font-semibold text-secondary">{user?.email}</p>
                        <span className="mt-1 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                            {role}
                        </span>
                    </div>
                </div>

                <label className="form-control w-full">
                    <span className="label-text mb-1 font-medium">Full name</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input input-bordered w-full rounded-xl"
                        required
                    />
                </label>

                <label className="form-control w-full">
                    <span className="label-text mb-1 font-medium">Photo URL</span>
                    <input
                        type="url"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        className="input input-bordered w-full rounded-xl"
                        placeholder="https://..."
                    />
                </label>

                <label className="form-control w-full">
                    <span className="label-text mb-1 font-medium">New password</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input input-bordered w-full rounded-xl"
                        placeholder="Leave blank to keep current password"
                        minLength={6}
                    />
                </label>

                {role === 'rider' && (
                    <div className="rounded-xl border border-[var(--zs-line)] bg-[var(--zs-mist)] p-4">
                        <p className="font-semibold text-secondary">Rider profile</p>
                        <p className="mt-1 text-sm text-[var(--zs-muted)]">
                            Your rider role is active. Pickup and delivery assignments will appear in your rider dashboard.
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={saving}
                    className="btn rounded-xl border-0 bg-primary px-8 font-semibold text-secondary hover:bg-primary/85"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </motion.form>
        </div>
    );
};

export default Settings;
