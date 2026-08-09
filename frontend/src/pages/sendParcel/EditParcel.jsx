import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import serviceCentersData from '../../data/serviceCenters.json';
import Loading from '../../components/Loading/Loading';

const calcCost = (data) => {
    const isDocument = data.parcelType === 'document';
    const isSameDistrict = data.senderDistrict === data.receiverDistrict;
    const parcelWeight = parseFloat(data.parcelWeight) || 0;
    if (isDocument) return isSameDistrict ? 60 : 80;
    if (parcelWeight <= 3) return isSameDistrict ? 110 : 150;
    const minCharge = isSameDistrict ? 110 : 150;
    const extraWeight = parcelWeight - 3;
    const extraCharge = isSameDistrict ? extraWeight * 40 : extraWeight * 40 + 40;
    return Math.round(minCharge + extraCharge);
};

const EditParcel = () => {
    const { parcelId } = useParams();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm();
    const serviceCenters = serviceCentersData || [];
    const regions = [...new Set(serviceCenters.map((c) => c.region))];
    const parcelType = useWatch({ control, name: 'parcelType', defaultValue: 'document' });
    const senderRegion = useWatch({ control, name: 'senderRegion' });
    const receiverRegion = useWatch({ control, name: 'receiverRegion' });
    const districtsByRegion = (region) =>
        serviceCenters.filter((c) => c.region === region).map((d) => d.district);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res = await axiosSecure.get(`/parcels/${parcelId}`);
                const p = res.data;
                if (p.paymentStatus === 'paid') {
                    Swal.fire({ icon: 'info', title: 'Paid parcels cannot be edited' });
                    navigate('/dashboard/my-parcels');
                    return;
                }
                if (alive) {
                    reset({
                        parcelType: p.parcelType || 'document',
                        parcelName: p.parcelName || '',
                        parcelWeight: p.parcelWeight || '',
                        senderName: p.senderName || user?.displayName || '',
                        senderContact: p.senderContact || '',
                        senderRegion: p.senderRegion || '',
                        senderDistrict: p.senderDistrict || '',
                        senderAddress: p.senderAddress || '',
                        pickupInstruction: p.pickupInstruction || '',
                        receiverName: p.receiverName || '',
                        receiverContact: p.receiverContact || '',
                        receiverRegion: p.receiverRegion || '',
                        receiverDistrict: p.receiverDistrict || '',
                        receiverAddress: p.receiverAddress || '',
                        deliveryInstruction: p.deliveryInstruction || ''
                    });
                }
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Parcel not found', text: error?.response?.data?.message || error.message });
                navigate('/dashboard/my-parcels');
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [parcelId, axiosSecure, navigate, reset, user?.displayName]);

    const onSubmit = async (data) => {
        if (data.parcelType !== 'document' && !parseFloat(data.parcelWeight)) {
            Swal.fire({ icon: 'error', title: 'Weight required' });
            return;
        }
        const cost = calcCost(data);
        const confirm = await Swal.fire({
            title: 'Update parcel?',
            text: `Updated cost will be ৳${cost}.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#03373D'
        });
        if (!confirm.isConfirmed) return;

        setSubmitting(true);
        try {
            const res = await axiosSecure.patch(`/parcels/${parcelId}/edit`, { ...data, cost });
            if (res.data.modifiedCount >= 0) {
                await Swal.fire({ icon: 'success', title: 'Parcel updated', timer: 1400, showConfirmButton: false });
                navigate('/dashboard/my-parcels');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update failed',
                text: error?.response?.data?.message || error.message
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="pb-12">
            <h2 className="text-3xl font-bold text-secondary dark:text-primary md:text-4xl">Edit Parcel</h2>
            <p className="mt-2 text-base-content/70">Update unpaid booking details before payment.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="zs-surface mt-8 space-y-8 p-4 md:p-6" noValidate>
                <div className="flex flex-wrap gap-4">
                    <label className="label cursor-pointer gap-2">
                        <input type="radio" {...register('parcelType')} value="document" className="radio radio-primary" />
                        <span>Document</span>
                    </label>
                    <label className="label cursor-pointer gap-2">
                        <input type="radio" {...register('parcelType')} value="non-document" className="radio radio-primary" />
                        <span>Non-Document</span>
                    </label>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="parcelName" className="mb-1 block text-sm font-medium">Parcel title</label>
                        <input id="parcelName" className="zs-input" {...register('parcelName', { required: 'Parcel title is required' })} />
                        {errors.parcelName && <p className="mt-1 text-sm text-error">{errors.parcelName.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="parcelWeight" className="mb-1 block text-sm font-medium">Weight (kg)</label>
                        <input id="parcelWeight" type="number" step="0.1" min="0" className="zs-input" {...register('parcelWeight')} />
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    <fieldset className="space-y-3">
                        <h4 className="text-xl font-semibold">Sender</h4>
                        <input className="zs-input" placeholder="Name" {...register('senderName', { required: 'Required' })} />
                        <input className="zs-input" placeholder="Contact" {...register('senderContact', { required: 'Required' })} />
                        <select className="zs-select" {...register('senderRegion', { required: 'Required' })}>
                            <option value="">Region</option>
                            {regions.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <select className="zs-select" {...register('senderDistrict', { required: 'Required' })}>
                            <option value="">District</option>
                            {districtsByRegion(senderRegion).map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <input className="zs-input" placeholder="Address" {...register('senderAddress', { required: 'Required' })} />
                        <input className="zs-input" placeholder="Pickup instruction" {...register('pickupInstruction', { required: 'Required' })} />
                    </fieldset>
                    <fieldset className="space-y-3">
                        <h4 className="text-xl font-semibold">Receiver</h4>
                        <input className="zs-input" placeholder="Name" {...register('receiverName', { required: 'Required' })} />
                        <input className="zs-input" placeholder="Contact" {...register('receiverContact', { required: 'Required' })} />
                        <select className="zs-select" {...register('receiverRegion', { required: 'Required' })}>
                            <option value="">Region</option>
                            {regions.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <select className="zs-select" {...register('receiverDistrict', { required: 'Required' })}>
                            <option value="">District</option>
                            {districtsByRegion(receiverRegion).map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <input className="zs-input" placeholder="Address" {...register('receiverAddress', { required: 'Required' })} />
                        <input className="zs-input" placeholder="Delivery instruction" {...register('deliveryInstruction', { required: 'Required' })} />
                    </fieldset>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button type="submit" disabled={submitting} className="zs-btn-primary">
                        {submitting ? <span className="loading loading-spinner loading-sm" /> : 'Save changes'}
                    </button>
                    <Link to="/dashboard/my-parcels" className="btn rounded-xl">Cancel</Link>
                </div>
                {parcelType === 'non-document' && (
                    <p className="text-sm text-base-content/60">Non-document parcels require a valid weight for pricing.</p>
                )}
            </form>
        </div>
    );
};

export default EditParcel;
