import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import SectionHeader from '../../components/ui/SectionHeader';
import useAxios from '../../hooks/useAxios';
import Swal from 'sweetalert2';

const Contact = () => {
    const axiosPublic = useAxios();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await axiosPublic.post('/contact', data);
            reset();
            Swal.fire({
                icon: 'success',
                title: 'Message sent',
                text: 'Our support team will reply shortly.',
                timer: 1800,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Could not send',
                text: error?.response?.data?.message || 'Please try again in a moment.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid gap-8 pb-12 lg:grid-cols-2">
            <div>
                <SectionHeader
                    align="left"
                    eyebrow="Contact"
                    title="Talk to ZapShift support"
                    subtitle="Questions about bookings, rider applications, or business shipping? Send a message."
                />
                <div className="zs-surface space-y-3 p-6">
                    <p><span className="font-semibold">Email:</span> support@zapshift.com</p>
                    <p><span className="font-semibold">Hotline:</span> 16263</p>
                    <p><span className="font-semibold">Office:</span> House 12, Road 5, Dhanmondi, Dhaka</p>
                    <p><span className="font-semibold">Hours:</span> Sat–Thu, 9:00 AM – 8:00 PM</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="zs-surface space-y-4 p-6" noValidate>
                <div>
                    <label htmlFor="contact-name" className="mb-1 block text-sm font-medium">Full name</label>
                    <input
                        id="contact-name"
                        className="zs-input"
                        {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Enter at least 2 characters' } })}
                    />
                    {errors.name && <p className="mt-1 text-sm text-error">{errors.name.message}</p>}
                </div>
                <div>
                    <label htmlFor="contact-email" className="mb-1 block text-sm font-medium">Email</label>
                    <input
                        id="contact-email"
                        type="email"
                        className="zs-input"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
                        })}
                    />
                    {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
                </div>
                <div>
                    <label htmlFor="contact-subject" className="mb-1 block text-sm font-medium">Subject</label>
                    <input
                        id="contact-subject"
                        className="zs-input"
                        {...register('subject', { required: 'Subject is required' })}
                    />
                    {errors.subject && <p className="mt-1 text-sm text-error">{errors.subject.message}</p>}
                </div>
                <div>
                    <label htmlFor="contact-message" className="mb-1 block text-sm font-medium">Message</label>
                    <textarea
                        id="contact-message"
                        className="textarea textarea-bordered w-full rounded-xl"
                        rows={5}
                        {...register('message', {
                            required: 'Message is required',
                            minLength: { value: 10, message: 'Please write at least 10 characters' }
                        })}
                    />
                    {errors.message && <p className="mt-1 text-sm text-error">{errors.message.message}</p>}
                </div>
                <button type="submit" disabled={loading} className="zs-btn-primary w-full">
                    {loading ? <span className="loading loading-spinner loading-sm" /> : 'Send message'}
                </button>
            </form>
        </div>
    );
};

export default Contact;
