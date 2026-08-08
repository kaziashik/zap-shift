import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import serviceCentersData from '../../data/serviceCenters.json';

const SendParcel = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const serviceCenters = serviceCentersData || [];
    const regions = [...new Set(serviceCenters.map((c) => c.region))];
    const parcelType = useWatch({ control, name: 'parcelType', defaultValue: 'document' });
    const senderRegion = useWatch({ control, name: 'senderRegion' });
    const receiverRegion = useWatch({ control, name: 'receiverRegion' });

    const districtsByRegion = (region) =>
        serviceCenters.filter((c) => c.region === region).map((d) => d.district);

    const handleSendParcel = async (data) => {
        const isDocument = data.parcelType === 'document';
        const isSameDistrict = data.senderDistrict === data.receiverDistrict;
        const parcelWeight = parseFloat(data.parcelWeight) || 0;

        if (!isDocument && !parcelWeight) {
            Swal.fire({ icon: 'error', title: 'Weight required', text: 'Enter parcel weight for non-document items.' });
            return;
        }

        let cost = 0;
        if (isDocument) {
            cost = isSameDistrict ? 60 : 80;
        } else if (parcelWeight <= 3) {
            cost = isSameDistrict ? 110 : 150;
        } else {
            const minCharge = isSameDistrict ? 110 : 150;
            const extraWeight = parcelWeight - 3;
            const extraCharge = isSameDistrict ? extraWeight * 40 : extraWeight * 40 + 40;
            cost = minCharge + extraCharge;
        }

        data.cost = cost;
        data.paymentStatus = 'unpaid';
        data.deliveryStatus = 'unpaid';
        data.senderEmail = user?.email;

        const confirm = await Swal.fire({
            title: 'Confirm delivery cost?',
            text: `You will be charged ৳${Math.round(cost)} for this parcel.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#03373D',
            confirmButtonText: 'Confirm & continue'
        });

        if (!confirm.isConfirmed) return;

        setSubmitting(true);
        try {
            const res = await axiosSecure.post('/parcels', data);
            if (res.data.insertedId) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Parcel created',
                    text: 'Please complete payment from My Parcels.',
                    timer: 2200,
                    showConfirmButton: false
                });
                navigate('/dashboard/my-parcels');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Could not create parcel',
                text: error?.response?.data?.message || error.message || 'Please try again.'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="pb-12">
            <h2 className="text-3xl font-bold text-secondary dark:text-primary md:text-5xl">Send A Parcel</h2>
            <p className="mt-2 text-base-content/70">Door-to-door booking with pickup and delivery details.</p>

            <form onSubmit={handleSubmit(handleSendParcel)} className="zs-surface mt-8 space-y-8 p-4 md:p-6" noValidate>
                <div className="flex flex-wrap gap-4">
                    <label className="label cursor-pointer gap-2">
                        <input type="radio" {...register('parcelType')} value="document" className="radio radio-primary" defaultChecked />
                        <span>Document</span>
                    </label>
                    <label className="label cursor-pointer gap-2">
                        <input type="radio" {...register('parcelType')} value="non-document" className="radio radio-primary" />
                        <span>Non-Document</span>
                    </label>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="parcelName" className="mb-1 block text-sm font-medium">Parcel title</label>
                        <input
                            id="parcelName"
                            type="text"
                            className="zs-input"
                            placeholder="e.g. Office contracts"
                            {...register('parcelName', { required: 'Parcel title is required' })}
                        />
                        {errors.parcelName && <p className="mt-1 text-sm text-error">{errors.parcelName.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="parcelWeight" className="mb-1 block text-sm font-medium">
                            Parcel weight (kg) {parcelType === 'document' ? '(optional)' : ''}
                        </label>
                        <input
                            id="parcelWeight"
                            type="number"
                            step="0.1"
                            min="0"
                            className="zs-input"
                            placeholder="Weight"
                            {...register('parcelWeight')}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <fieldset className="space-y-3">
                        <h4 className="text-2xl font-semibold text-secondary dark:text-primary">Sender details</h4>
                        <div>
                            <label htmlFor="senderName" className="mb-1 block text-sm font-medium">Name</label>
                            <input id="senderName" className="zs-input" defaultValue={user?.displayName} {...register('senderName', { required: 'Sender name is required' })} />
                            {errors.senderName && <p className="mt-1 text-sm text-error">{errors.senderName.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="senderContact" className="mb-1 block text-sm font-medium">Contact</label>
                            <input id="senderContact" className="zs-input" placeholder="01XXXXXXXXX" {...register('senderContact', { required: 'Sender contact is required' })} />
                            {errors.senderContact && <p className="mt-1 text-sm text-error">{errors.senderContact.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="senderRegion" className="mb-1 block text-sm font-medium">Region</label>
                            <select id="senderRegion" className="select select-bordered w-full rounded-xl" defaultValue="" {...register('senderRegion', { required: 'Select sender region' })}>
                                <option value="" disabled>Pick a region</option>
                                {regions.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                            {errors.senderRegion && <p className="mt-1 text-sm text-error">{errors.senderRegion.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="senderDistrict" className="mb-1 block text-sm font-medium">Service center / district</label>
                            <select id="senderDistrict" className="select select-bordered w-full rounded-xl" defaultValue="" {...register('senderDistrict', { required: 'Select sender district' })}>
                                <option value="" disabled>Pick a district</option>
                                {districtsByRegion(senderRegion).map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                            {errors.senderDistrict && <p className="mt-1 text-sm text-error">{errors.senderDistrict.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="senderAddress" className="mb-1 block text-sm font-medium">Address</label>
                            <input id="senderAddress" className="zs-input" {...register('senderAddress', { required: 'Sender address is required' })} />
                            {errors.senderAddress && <p className="mt-1 text-sm text-error">{errors.senderAddress.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="pickupInstruction" className="mb-1 block text-sm font-medium">Pickup instruction</label>
                            <input id="pickupInstruction" className="zs-input" {...register('pickupInstruction', { required: 'Pickup instruction is required' })} />
                            {errors.pickupInstruction && <p className="mt-1 text-sm text-error">{errors.pickupInstruction.message}</p>}
                        </div>
                    </fieldset>

                    <fieldset className="space-y-3">
                        <h4 className="text-2xl font-semibold text-secondary dark:text-primary">Receiver details</h4>
                        <div>
                            <label htmlFor="receiverName" className="mb-1 block text-sm font-medium">Name</label>
                            <input id="receiverName" className="zs-input" {...register('receiverName', { required: 'Receiver name is required' })} />
                            {errors.receiverName && <p className="mt-1 text-sm text-error">{errors.receiverName.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="receiverContact" className="mb-1 block text-sm font-medium">Contact</label>
                            <input id="receiverContact" className="zs-input" placeholder="01XXXXXXXXX" {...register('receiverContact', { required: 'Receiver contact is required' })} />
                            {errors.receiverContact && <p className="mt-1 text-sm text-error">{errors.receiverContact.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="receiverRegion" className="mb-1 block text-sm font-medium">Region</label>
                            <select id="receiverRegion" className="select select-bordered w-full rounded-xl" defaultValue="" {...register('receiverRegion', { required: 'Select receiver region' })}>
                                <option value="" disabled>Pick a region</option>
                                {regions.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                            {errors.receiverRegion && <p className="mt-1 text-sm text-error">{errors.receiverRegion.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="receiverDistrict" className="mb-1 block text-sm font-medium">Service center / district</label>
                            <select id="receiverDistrict" className="select select-bordered w-full rounded-xl" defaultValue="" {...register('receiverDistrict', { required: 'Select receiver district' })}>
                                <option value="" disabled>Pick a district</option>
                                {districtsByRegion(receiverRegion).map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                            {errors.receiverDistrict && <p className="mt-1 text-sm text-error">{errors.receiverDistrict.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="receiverAddress" className="mb-1 block text-sm font-medium">Address</label>
                            <input id="receiverAddress" className="zs-input" {...register('receiverAddress', { required: 'Receiver address is required' })} />
                            {errors.receiverAddress && <p className="mt-1 text-sm text-error">{errors.receiverAddress.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="deliveryInstruction" className="mb-1 block text-sm font-medium">Delivery instruction</label>
                            <input id="deliveryInstruction" className="zs-input" {...register('deliveryInstruction', { required: 'Delivery instruction is required' })} />
                            {errors.deliveryInstruction && <p className="mt-1 text-sm text-error">{errors.deliveryInstruction.message}</p>}
                        </div>
                    </fieldset>
                </div>

                <button type="submit" disabled={submitting} className="zs-btn-primary">
                    {submitting ? <span className="loading loading-spinner loading-sm" /> : 'Calculate & Send Parcel'}
                </button>
            </form>
        </div>
    );
};

export default SendParcel;
