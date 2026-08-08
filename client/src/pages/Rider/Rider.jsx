import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import serviceCentersData from '../../data/serviceCenters.json';

const Rider = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [submitting, setSubmitting] = useState(false);

    const serviceCenters = serviceCentersData || [];
    const regions = [...new Set(serviceCenters.map((c) => c.region))];
    const riderRegion = useWatch({ control, name: 'region' });

    const districtsByRegion = (region) =>
        serviceCenters.filter((c) => c.region === region).map((d) => d.district);

    const handleRiderApplication = async (data) => {
        setSubmitting(true);
        try {
            const payload = {
                ...data,
                email: user?.email,
                name: data.name || user?.displayName,
                status: 'pending',
                workStatus: 'available',
                createdAt: new Date()
            };
            const res = await axiosSecure.post('/riders', payload);
            if (res.data.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Application submitted',
                    text: 'An admin will review your rider application soon.',
                    timer: 2200,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Could not submit',
                text: error?.response?.data?.message || error.message || 'Please try again.'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="pb-12">
            <h2 className="text-3xl font-bold text-secondary dark:text-primary md:text-4xl">Be a Rider</h2>
            <p className="mt-2 text-base-content/70">Apply to deliver with ZapShift across your district.</p>

            <form onSubmit={handleSubmit(handleRiderApplication)} className="zs-surface mt-8 space-y-6 p-4 md:p-6" noValidate>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <fieldset className="space-y-3">
                        <h4 className="text-xl font-semibold">Rider details</h4>
                        <div>
                            <label htmlFor="rider-name" className="mb-1 block text-sm font-medium">Name</label>
                            <input id="rider-name" className="zs-input" defaultValue={user?.displayName} {...register('name', { required: 'Name is required' })} />
                            {errors.name && <p className="mt-1 text-sm text-error">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="rider-email" className="mb-1 block text-sm font-medium">Email</label>
                            <input id="rider-email" className="zs-input" defaultValue={user?.email} readOnly {...register('email')} />
                        </div>
                        <div>
                            <label htmlFor="rider-region" className="mb-1 block text-sm font-medium">Region</label>
                            <select id="rider-region" className="select select-bordered w-full rounded-xl" defaultValue="" {...register('region', { required: 'Select a region' })}>
                                <option value="" disabled>Pick a region</option>
                                {regions.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                            {errors.region && <p className="mt-1 text-sm text-error">{errors.region.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="rider-district" className="mb-1 block text-sm font-medium">District</label>
                            <select id="rider-district" className="select select-bordered w-full rounded-xl" defaultValue="" {...register('district', { required: 'Select a district' })}>
                                <option value="" disabled>Pick a district</option>
                                {districtsByRegion(riderRegion).map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                            {errors.district && <p className="mt-1 text-sm text-error">{errors.district.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="rider-address" className="mb-1 block text-sm font-medium">Address</label>
                            <input id="rider-address" className="zs-input" {...register('address', { required: 'Address is required' })} />
                            {errors.address && <p className="mt-1 text-sm text-error">{errors.address.message}</p>}
                        </div>
                    </fieldset>

                    <fieldset className="space-y-3">
                        <h4 className="text-xl font-semibold">Documents</h4>
                        <div>
                            <label htmlFor="rider-license" className="mb-1 block text-sm font-medium">Driving license</label>
                            <input id="rider-license" className="zs-input" {...register('license', { required: 'License is required' })} />
                            {errors.license && <p className="mt-1 text-sm text-error">{errors.license.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="rider-nid" className="mb-1 block text-sm font-medium">NID</label>
                            <input id="rider-nid" className="zs-input" {...register('nid', { required: 'NID is required' })} />
                            {errors.nid && <p className="mt-1 text-sm text-error">{errors.nid.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="rider-bike" className="mb-1 block text-sm font-medium">Bike details</label>
                            <input id="rider-bike" className="zs-input" {...register('bike', { required: 'Bike details are required' })} />
                            {errors.bike && <p className="mt-1 text-sm text-error">{errors.bike.message}</p>}
                        </div>
                    </fieldset>
                </div>

                <button type="submit" disabled={submitting} className="zs-btn-primary">
                    {submitting ? <span className="loading loading-spinner loading-sm" /> : 'Apply as a Rider'}
                </button>
            </form>
        </div>
    );
};

export default Rider;
