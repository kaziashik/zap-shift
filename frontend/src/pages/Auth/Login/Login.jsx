import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import Swal from 'sweetalert2';

const DEMO_EMAIL = 'demo@zapshift.com';
const DEMO_PASSWORD = 'Demo@12345';

const Login = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { signInUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (data) => {
        setLoading(true);
        try {
            await signInUser(data.email, data.password);
            Swal.fire({
                icon: 'success',
                title: 'Welcome back',
                timer: 1200,
                showConfirmButton: false
            });
            navigate(location?.state || '/dashboard');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Login failed',
                text: error.message || 'Invalid email or password'
            });
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = () => {
        setValue('email', DEMO_EMAIL, { shouldValidate: true });
        setValue('password', DEMO_PASSWORD, { shouldValidate: true });
    };

    return (
        <div className="zs-surface mx-auto w-full max-w-md p-6 md:p-8">
            <h3 className="text-center text-3xl font-bold text-secondary dark:text-primary">Welcome back</h3>
            <p className="mt-2 text-center text-base-content/70">Sign in to manage parcels and deliveries</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit(handleLogin)} noValidate>
                <div>
                    <label htmlFor="login-email" className="mb-1 block text-sm font-medium">Email</label>
                    <input
                        id="login-email"
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
                    <label htmlFor="login-password" className="mb-1 block text-sm font-medium">Password</label>
                    <input
                        id="login-password"
                        type="password"
                        className="zs-input"
                        placeholder="••••••••"
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Password must be at least 6 characters' }
                        })}
                    />
                    {errors.password && <p className="mt-1 text-sm text-error">{errors.password.message}</p>}
                </div>

                <button type="button" onClick={fillDemo} className="btn btn-outline btn-sm w-full rounded-xl">
                    Demo login (auto-fill)
                </button>

                <button type="submit" disabled={loading} className="zs-btn-primary w-full">
                    {loading ? <span className="loading loading-spinner loading-sm" /> : 'Login'}
                </button>
            </form>

            <p className="mt-4 text-center text-sm">
                New to ZapShift?{' '}
                <Link state={location.state} className="font-semibold text-secondary underline dark:text-primary" to="/register">
                    Register
                </Link>
            </p>
            <div className="divider">OR</div>
            <SocialLogin />
            <p className="mt-3 text-center text-xs text-base-content/60">
                Admin demo: {DEMO_EMAIL} / {DEMO_PASSWORD}<br />
                User demo: user@zapshift.com / User@12345
            </p>
        </div>
    );
};

export default Login;
