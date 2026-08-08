import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';
import useAxios from '../../../hooks/useAxios';
import Swal from 'sweetalert2';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { registerUser, updateUserProfile } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const axiosPublic = useAxios();
    const [loading, setLoading] = useState(false);

    const handleRegistration = async (data) => {
        setLoading(true);
        try {
            await registerUser(data.email, data.password);

            let photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=03373D&color=CAEB66`;
            const profileImg = data.photo?.[0];

            if (profileImg && import.meta.env.VITE_image_host_key) {
                const formData = new FormData();
                formData.append('image', profileImg);
                const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;
                const res = await axios.post(image_API_URL, formData);
                photoURL = res.data.data.url;
            }

            await axiosPublic.post('/users', {
                email: data.email,
                displayName: data.name,
                photoURL,
                role: 'user',
                createdAt: new Date()
            });

            await updateUserProfile({
                displayName: data.name,
                photoURL
            });

            Swal.fire({
                icon: 'success',
                title: 'Account created',
                timer: 1400,
                showConfirmButton: false
            });
            navigate(location.state || '/dashboard');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Registration failed',
                text: error.message || 'Please try again'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="zs-surface mx-auto w-full max-w-md p-6 md:p-8">
            <h3 className="text-center text-3xl font-bold text-secondary dark:text-primary">Join ZapShift</h3>
            <p className="mt-2 text-center text-base-content/70">Create your account to start shipping</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit(handleRegistration)} noValidate>
                <div>
                    <label htmlFor="reg-name" className="mb-1 block text-sm font-medium">Full name</label>
                    <input
                        id="reg-name"
                        className="zs-input"
                        placeholder="Your name"
                        {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Enter at least 2 characters' } })}
                    />
                    {errors.name && <p className="mt-1 text-sm text-error">{errors.name.message}</p>}
                </div>

                <div>
                    <label htmlFor="reg-photo" className="mb-1 block text-sm font-medium">Photo (optional)</label>
                    <input id="reg-photo" type="file" accept="image/*" className="file-input file-input-bordered w-full rounded-xl" {...register('photo')} />
                </div>

                <div>
                    <label htmlFor="reg-email" className="mb-1 block text-sm font-medium">Email</label>
                    <input
                        id="reg-email"
                        type="email"
                        className="zs-input"
                        placeholder="you@email.com"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
                        })}
                    />
                    {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="reg-password" className="mb-1 block text-sm font-medium">Password</label>
                    <input
                        id="reg-password"
                        type="password"
                        className="zs-input"
                        placeholder="Strong password"
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Minimum 6 characters' },
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
                                message: 'Use upper, lower, number, and special character'
                            }
                        })}
                    />
                    {errors.password && <p className="mt-1 text-sm text-error">{errors.password.message}</p>}
                </div>

                <button type="submit" disabled={loading} className="zs-btn-primary w-full">
                    {loading ? <span className="loading loading-spinner loading-sm" /> : 'Create account'}
                </button>
            </form>

            <p className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link state={location.state} className="font-semibold text-secondary underline dark:text-primary" to="/login">
                    Login
                </Link>
            </p>
            <div className="divider">OR</div>
            <SocialLogin />
        </div>
    );
};

export default Register;
