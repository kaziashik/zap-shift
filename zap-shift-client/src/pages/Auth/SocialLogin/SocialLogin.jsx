import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router';
import useAxios from '../../../hooks/useAxios';
import Swal from 'sweetalert2';

const SocialLogin = () => {
    const { signInGoogle } = useAuth();
    const axiosPublic = useAxios();
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const result = await signInGoogle();
            await axiosPublic.post('/users', {
                email: result.user.email,
                displayName: result.user.displayName,
                photoURL: result.user.photoURL,
                role: 'user',
                createdAt: new Date()
            });
            navigate(location.state || '/dashboard');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Google login failed',
                text: error.message || 'Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-center pb-2">
            <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="btn w-full rounded-xl border border-base-300 bg-base-100"
            >
                {loading ? (
                    <span className="loading loading-spinner loading-sm" />
                ) : (
                    <>
                        <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <g>
                                <path d="m0 0H512V512H0" fill="#fff"></path>
                                <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
                                <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                                <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                                <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
                            </g>
                        </svg>
                        Continue with Google
                    </>
                )}
            </button>
        </div>
    );
};

export default SocialLogin;
