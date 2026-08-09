import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import serviceCentersData from '../../data/serviceCenters.json';

const FieldError = ({ message }) =>
    message ? <p className="mt-1.5 text-sm font-medium text-error">{message}</p> : null;

const SendParcel = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm({
        defaultValues: {
            parcelType: 'document'
        }
    });
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const serviceCenters = serviceCentersData || [];
    const regions = [...new Set(serviceCenters.map((c) => c.region))];
    const parcelType = useWatch({ control, name: 'parcelType' });
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
            cost = Math.round(minCharge + extraCharge);
        }

        data.cost = Math.round(cost);
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
        <div className="mx-auto max-w-6xl pb-14">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/55">Booking</p>
                <h2 className="mt-1 text-3xl font-bold text-secondary dark:text-primary md:text-4xl">Send a Parcel</h2>
                <p className="mt-2 max-w-2xl text-base-content/70">
                    Fill pickup and delivery details. Cost is calculated from type, weight, and same-city vs outside-city route.
                </p>
            </div>

            <form onSubmit={handleSubmit(handleSendParcel)} className="space-y-6" noValidate>
                {/* Parcel basics */}
                <section className="zs-surface space-y-5 p-5 md:p-7">
                    <div>
                        <h3 className="text-lg font-bold text-secondary dark:text-primary">Parcel type</h3>
                        <p className="mt-1 text-sm text-base-content/65">Choose document or non-document before pricing.</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${parcelType === 'document' ? 'border-primary bg-primary/15' : 'border-base-300 hover:border-primary/50'}`}>
                            <input type="radio" value="document" className="radio radio-primary" {...register('parcelType')} />
                            <span>
                                <span className="block font-semibold">Document</span>
                                <span className="text-xs text-base-content/60">৳60 same city · ৳80 outside</span>
                            </span>
                        </label>
                        <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${parcelType === 'non-document' ? 'border-primary bg-primary/15' : 'border-base-300 hover:border-primary/50'}`}>
                            <input type="radio" value="non-document" className="radio radio-primary" {...register('parcelType')} />
                            <span>
                                <span className="block font-semibold">Non-Document</span>
                                <span className="text-xs text-base-content/60">From ৳110 · weight-based</span>
                            </span>
                        </label>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label htmlFor="parcelName" className="zs-label">Parcel title</label>
                            <input
                                id="parcelName"
                                type="text"
                                className="zs-input"
                                placeholder="e.g. Office contracts"
                                {...register('parcelName', { required: 'Parcel title is required' })}
                            />
                            <FieldError message={errors.parcelName?.message} />
                        </div>
                        <div>
                            <label htmlFor="parcelWeight" className="zs-label">
                                Weight (kg) {parcelType === 'document' ? <span className="font-normal text-base-content/50">· optional</span> : <span className="text-error">*</span>}
                            </label>
                            <input
                                id="parcelWeight"
                                type="number"
                                step="0.1"
                                min="0"
                                className="zs-input"
                                placeholder={parcelType === 'document' ? 'Optional' : 'Enter weight'}
                                {...register('parcelWeight')}
                            />
                        </div>
                    </div>
                </section>

                {/* Sender / Receiver */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <fieldset className="zs-surface space-y-4 p-5 md:p-7">
                        <legend className="px-1 text-lg font-bold text-secondary dark:text-primary">Sender details</legend>

                        <div>
                            <label htmlFor="senderName" className="zs-label">Name</label>
                            <input
                                id="senderName"
                                className="zs-input"
                                defaultValue={user?.displayName || ''}
                                placeholder="Full name"
                                {...register('senderName', { required: 'Sender name is required' })}
                            />
                            <FieldError message={errors.senderName?.message} />
                        </div>

                        <div>
                            <label htmlFor="senderContact" className="zs-label">Contact</label>
                            <input
                                id="senderContact"
                                className="zs-input"
                                placeholder="01XXXXXXXXX"
                                {...register('senderContact', { required: 'Sender contact is required' })}
                            />
                            <FieldError message={errors.senderContact?.message} />
                        </div>

                        <div>
                            <label htmlFor="senderRegion" className="zs-label">Region</label>
                            <select
                                id="senderRegion"
                                className="zs-select"
                                defaultValue=""
                                {...register('senderRegion', { required: 'Select sender region' })}
                            >
                                <option value="" disabled>Pick a region</option>
                                {regions.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <FieldError message={errors.senderRegion?.message} />
                        </div>

                        <div>
                            <label htmlFor="senderDistrict" className="zs-label">Service center / district</label>
                            <select
                                id="senderDistrict"
                                className="zs-select"
                                defaultValue=""
                                disabled={!senderRegion}
                                {...register('senderDistrict', { required: 'Select sender district' })}
                            >
                                <option value="" disabled>{senderRegion ? 'Pick a district' : 'Select region first'}</option>
                                {districtsByRegion(senderRegion).map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <FieldError message={errors.senderDistrict?.message} />
                        </div>

                        <div>
                            <label htmlFor="senderAddress" className="zs-label">Address</label>
                            <input
                                id="senderAddress"
                                className="zs-input"
                                placeholder="House, road, area"
                                {...register('senderAddress', { required: 'Sender address is required' })}
                            />
                            <FieldError message={errors.senderAddress?.message} />
                        </div>

                        <div>
                            <label htmlFor="pickupInstruction" className="zs-label">Pickup instruction</label>
                            <input
                                id="pickupInstruction"
                                className="zs-input"
                                placeholder="e.g. Call on arrival"
                                {...register('pickupInstruction', { required: 'Pickup instruction is required' })}
                            />
                            <FieldError message={errors.pickupInstruction?.message} />
                        </div>
                    </fieldset>

                    <fieldset className="zs-surface space-y-4 p-5 md:p-7">
                        <legend className="px-1 text-lg font-bold text-secondary dark:text-primary">Receiver details</legend>

                        <div>
                            <label htmlFor="receiverName" className="zs-label">Name</label>
                            <input
                                id="receiverName"
                                className="zs-input"
                                placeholder="Full name"
                                {...register('receiverName', { required: 'Receiver name is required' })}
                            />
                            <FieldError message={errors.receiverName?.message} />
                        </div>

                        <div>
                            <label htmlFor="receiverContact" className="zs-label">Contact</label>
                            <input
                                id="receiverContact"
                                className="zs-input"
                                placeholder="01XXXXXXXXX"
                                {...register('receiverContact', { required: 'Receiver contact is required' })}
                            />
                            <FieldError message={errors.receiverContact?.message} />
                        </div>

                        <div>
                            <label htmlFor="receiverRegion" className="zs-label">Region</label>
                            <select
                                id="receiverRegion"
                                className="zs-select"
                                defaultValue=""
                                {...register('receiverRegion', { required: 'Select receiver region' })}
                            >
                                <option value="" disabled>Pick a region</option>
                                {regions.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <FieldError message={errors.receiverRegion?.message} />
                        </div>

                        <div>
                            <label htmlFor="receiverDistrict" className="zs-label">Service center / district</label>
                            <select
                                id="receiverDistrict"
                                className="zs-select"
                                defaultValue=""
                                disabled={!receiverRegion}
                                {...register('receiverDistrict', { required: 'Select receiver district' })}
                            >
                                <option value="" disabled>{receiverRegion ? 'Pick a district' : 'Select region first'}</option>
                                {districtsByRegion(receiverRegion).map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <FieldError message={errors.receiverDistrict?.message} />
                        </div>

                        <div>
                            <label htmlFor="receiverAddress" className="zs-label">Address</label>
                            <input
                                id="receiverAddress"
                                className="zs-input"
                                placeholder="House, road, area"
                                {...register('receiverAddress', { required: 'Receiver address is required' })}
                            />
                            <FieldError message={errors.receiverAddress?.message} />
                        </div>

                        <div>
                            <label htmlFor="deliveryInstruction" className="zs-label">Delivery instruction</label>
                            <input
                                id="deliveryInstruction"
                                className="zs-input"
                                placeholder="e.g. Leave at reception"
                                {...register('deliveryInstruction', { required: 'Delivery instruction is required' })}
                            />
                            <FieldError message={errors.deliveryInstruction?.message} />
                        </div>
                    </fieldset>
                </div>

                <div className="zs-surface flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
                    <p className="text-sm text-base-content/65">
                        After create, pay from <span className="font-semibold text-secondary dark:text-primary">My Parcels</span> to unlock tracking.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link to="/dashboard/my-parcels" className="btn rounded-xl border-base-300 bg-base-100">
                            Cancel
                        </Link>
                        <button type="submit" disabled={submitting} className="zs-btn-primary min-w-[12rem]">
                            {submitting ? <span className="loading loading-spinner loading-sm" /> : 'Calculate & Send Parcel'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SendParcel;
