import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import Swal from 'sweetalert2';

const DEMO_ACCOUNTS = [
    {
        key: 'user',
        label: 'Customer',
        hint: 'Book & track parcels',
        email: 'user@zapshift.com',
        password: 'User@12345'
    },
    {
        key: 'admin',
        label: 'Admin',
        hint: 'Assign riders & manage',
        email: 'demo@zapshift.com',
        password: 'Demo@12345'
    },
    {
        key: 'rider',
        label: 'Rider',
        hint: 'Pickup & deliver',
        email: 'rider@zapshift.com',
        password: 'Rider@12345'
    }
];

const Login = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { signInUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [demoLoading, setDemoLoading] = useState('');

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

    const fillAndLoginDemo = async (account) => {
        setValue('email', account.email, { shouldValidate: true });
        setValue('password', account.password, { shouldValidate: true });
        setDemoLoading(account.key);
        try {
            await signInUser(account.email, account.password);
            Swal.fire({
                icon: 'success',
                title: `Signed in as ${account.label}`,
                timer: 1200,
                showConfirmButton: false
            });
            navigate(location?.state || '/dashboard');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: `${account.label} demo login failed`,
                text: error.message || 'Create this demo account first, then try again.'
            });
        } finally {
            setDemoLoading('');
        }
    };

    return (
        <div className="zs-surface mx-auto w-full max-w-md p-6 md:p-8">
            <h3 className="text-center text-3xl font-bold text-secondary dark:text-primary">Welcome back</h3>
            <p className="mt-2 text-center text-base-content/70">Sign in to manage parcels and deliveries</p>

            <div className="mt-6 rounded-2xl border border-base-300 bg-base-200/50 p-4">
                <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-base-content/55">
                    Quick demo access
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {DEMO_ACCOUNTS.map((account) => (
                        <button
                            key={account.key}
                            type="button"
                            disabled={!!demoLoading || loading}
                            onClick={() => fillAndLoginDemo(account)}
                            className="btn btn-outline h-auto min-h-0 flex-col gap-0.5 rounded-xl border-base-300 bg-base-100 px-2 py-3 hover:border-primary hover:bg-primary/15"
                        >
                            {demoLoading === account.key ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                <>
                                    <span className="text-sm font-bold text-secondary dark:text-primary">{account.label}</span>
                                    <span className="text-[10px] font-normal normal-case tracking-normal text-base-content/55">
                                        {account.hint}
                                    </span>
                                </>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit(handleLogin)} noValidate>
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

                <button type="submit" disabled={loading || !!demoLoading} className="zs-btn-primary w-full">
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
            <div className="mt-3 space-y-1 text-center text-xs text-base-content/60">
                {DEMO_ACCOUNTS.map((account) => (
                    <p key={account.key}>
                        {account.label}: {account.email} / {account.password}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default Login;
