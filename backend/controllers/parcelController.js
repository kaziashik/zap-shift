const { generateTrackingId } = require('../utils/trackingId');
const { logTracking } = require('../middleware/logging');
const { calculateParcelCost, isSameCityParcel, calculateRiderPayout } = require('../utils/pricing');
const {
    STATUS,
    normalizeStatus,
    generateOtp,
    hashOtp,
    verifyOtp,
    canTransition,
    ACTIVE_STATUSES,
    COMPLETED_STATUSES
} = require('../utils/deliveryStatus');

class ParcelController {
    constructor(models, collections) {
        this.Parcel = models.Parcel;
        this.Rider = models.Rider;
        this.User = models.User;
        this.collections = collections;
    }

    async getAllParcels(req, res) {
        try {
            const query = {};
            const { email, deliveryStatus } = req.query;
            const currentUser = await this.User.findByEmail(req.decoded_email);

            if (!currentUser || currentUser.role !== 'admin') {
                query.senderEmail = req.decoded_email;
            } else if (email) {
                query.senderEmail = email;
            }

            if (deliveryStatus) {
                // Support paid queue + legacy pending-pickup for admin assign screen
                if (deliveryStatus === STATUS.PAID || deliveryStatus === 'pending-pickup') {
                    query.deliveryStatus = { $in: [STATUS.PAID, 'pending-pickup'] };
                } else {
                    query.deliveryStatus = deliveryStatus;
                }
            }

            const result = await this.Parcel.findAll(query);
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching parcels', error: error.message });
        }
    }

    async getRiderParcels(req, res) {
        try {
            const { deliveryStatus } = req.query;
            const query = { riderEmail: req.decoded_email };

            if (deliveryStatus === STATUS.DELIVERED || deliveryStatus === 'parcel_delivered') {
                query.deliveryStatus = { $in: COMPLETED_STATUSES };
            } else if (deliveryStatus) {
                query.deliveryStatus = deliveryStatus;
            } else {
                query.deliveryStatus = { $in: ACTIVE_STATUSES };
            }

            const parcels = await this.Parcel.findAll(query);
            const result = parcels.map((p) => ({
                ...p,
                normalizedStatus: normalizeStatus(p.deliveryStatus),
                sameCity: isSameCityParcel(p),
                riderPayout: calculateRiderPayout(p)
            }));
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching rider parcels', error: error.message });
        }
    }

    async getParcelById(req, res) {
        try {
            const id = req.params.id;
            const parcel = await this.Parcel.findById(id);

            if (!parcel) {
                return res.status(404).send({ message: 'parcel not found' });
            }

            const currentUser = await this.User.findByEmail(req.decoded_email);
            const isOwner = parcel.senderEmail === req.decoded_email;
            const isAssignedRider = parcel.riderEmail === req.decoded_email;
            const isAdmin = currentUser && currentUser.role === 'admin';

            if (!isOwner && !isAssignedRider && !isAdmin) {
                return res.status(403).send({ message: 'forbidden access' });
            }

            // OTP visible only to owner (receiver confirmation code) while awaiting delivery
            const payload = { ...parcel, normalizedStatus: normalizeStatus(parcel.deliveryStatus) };
            if (!isOwner && payload.deliveryOtp) {
                delete payload.deliveryOtp;
            }
            if (payload.otpHash) {
                delete payload.otpHash;
            }

            res.send(payload);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching parcel', error: error.message });
        }
    }

    async getDeliveryStatusStats(req, res) {
        try {
            const result = await this.Parcel.getDeliveryStatusStats();
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error fetching delivery status stats', error: error.message });
        }
    }

    validateParcelFields(parcel) {
        const required = [
            'parcelType', 'parcelName', 'senderName', 'senderContact', 'senderRegion', 'senderDistrict',
            'senderAddress', 'pickupInstruction', 'receiverName', 'receiverContact', 'receiverRegion',
            'receiverDistrict', 'receiverAddress', 'deliveryInstruction'
        ];
        const missing = required.filter((key) => !String(parcel[key] || '').trim());
        if (missing.length) {
            return `Missing required fields: ${missing.join(', ')}`;
        }
        if (!['document', 'non-document'].includes(parcel.parcelType)) {
            return 'parcelType must be document or non-document';
        }
        if (parcel.parcelType === 'non-document' && !(parseFloat(parcel.parcelWeight) > 0)) {
            return 'parcelWeight is required for non-document parcels';
        }
        return null;
    }

    async createParcel(req, res) {
        try {
            const parcel = req.body;
            const fieldError = this.validateParcelFields(parcel);
            if (fieldError) {
                return res.status(400).send({ message: fieldError });
            }

            const expectedCost = calculateParcelCost(parcel);

            if (Number(parcel.cost) !== Number(expectedCost)) {
                return res.status(400).send({
                    message: 'Invalid parcel cost',
                    expectedCost,
                    receivedCost: parcel.cost
                });
            }

            const trackingId = generateTrackingId();
            parcel.createdAt = new Date();
            parcel.trackingId = trackingId;
            parcel.senderEmail = req.decoded_email;
            parcel.paymentStatus = 'unpaid';
            parcel.deliveryStatus = STATUS.UNPAID;
            parcel.cost = expectedCost;
            parcel.sameCity = isSameCityParcel(parcel);

            logTracking(this.collections.trackings, trackingId, 'parcel_created');

            const result = await this.Parcel.create(parcel);
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error creating parcel', error: error.message });
        }
    }

    async editParcel(req, res) {
        try {
            const id = req.params.id;
            const parcel = await this.Parcel.findById(id);
            if (!parcel) {
                return res.status(404).send({ message: 'parcel not found' });
            }
            if (parcel.senderEmail !== req.decoded_email) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            if (parcel.paymentStatus === 'paid') {
                return res.status(400).send({ message: 'Paid parcels cannot be edited' });
            }

            const updates = req.body;
            const fieldError = this.validateParcelFields(updates);
            if (fieldError) {
                return res.status(400).send({ message: fieldError });
            }

            const expectedCost = calculateParcelCost(updates);
            if (Number(updates.cost) !== Number(expectedCost)) {
                return res.status(400).send({
                    message: 'Invalid parcel cost',
                    expectedCost,
                    receivedCost: updates.cost
                });
            }

            const allowed = {
                parcelType: updates.parcelType,
                parcelName: updates.parcelName,
                parcelWeight: updates.parcelWeight,
                senderName: updates.senderName,
                senderContact: updates.senderContact,
                senderRegion: updates.senderRegion,
                senderDistrict: updates.senderDistrict,
                senderAddress: updates.senderAddress,
                pickupInstruction: updates.pickupInstruction,
                receiverName: updates.receiverName,
                receiverContact: updates.receiverContact,
                receiverRegion: updates.receiverRegion,
                receiverDistrict: updates.receiverDistrict,
                receiverAddress: updates.receiverAddress,
                deliveryInstruction: updates.deliveryInstruction,
                cost: expectedCost,
                sameCity: isSameCityParcel(updates),
                updatedAt: new Date()
            };

            const result = await this.Parcel.update(id, allowed);
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error editing parcel', error: error.message });
        }
    }

    async updateParcelStatus(req, res) {
        try {
            const { deliveryStatus, riderId, trackingId, otp } = req.body;
            const id = req.params.id;

            const parcel = await this.Parcel.findById(id);
            if (!parcel) {
                return res.status(404).send({ message: 'parcel not found' });
            }

            const currentUser = await this.User.findByEmail(req.decoded_email);
            const isRider = currentUser && currentUser.role === 'rider';
            const isAdmin = currentUser && currentUser.role === 'admin';
            const isAssignedRider = parcel.riderEmail === req.decoded_email;

            if (!isAdmin && !(isRider && isAssignedRider)) {
                return res.status(403).send({ message: 'forbidden access' });
            }

            const next = normalizeStatus(deliveryStatus);
            const sameCity = isSameCityParcel(parcel);

            if (!isAdmin && !canTransition(parcel.deliveryStatus, next, sameCity)) {
                return res.status(400).send({
                    message: 'Invalid status transition',
                    current: normalizeStatus(parcel.deliveryStatus),
                    requested: next,
                    sameCity
                });
            }

            const update = { deliveryStatus: next };

            // Generate OTP when out for delivery
            let issuedOtp = null;
            if (next === STATUS.READY_FOR_DELIVERY) {
                issuedOtp = generateOtp();
                update.deliveryOtp = issuedOtp;
                update.otpHash = hashOtp(issuedOtp);
            }

            // Require OTP to complete delivery
            if (next === STATUS.DELIVERED) {
                const valid = verifyOtp(otp, parcel.otpHash) || (parcel.deliveryOtp && String(otp) === String(parcel.deliveryOtp));
                if (!valid) {
                    return res.status(400).send({ message: 'Invalid or missing delivery OTP' });
                }
                update.deliveryOtp = null;
                update.otpHash = null;
                update.deliveredAt = new Date();
                update.riderPayout = calculateRiderPayout(parcel);
            }

            const result = await this.Parcel.update(id, update);

            if (next === STATUS.DELIVERED && (riderId || parcel.riderId)) {
                await this.Rider.updateWorkStatus(riderId || parcel.riderId, 'available');
            }

            logTracking(this.collections.trackings, trackingId || parcel.trackingId, next);

            res.send({
                ...result,
                deliveryStatus: next,
                otpIssued: issuedOtp || undefined
            });
        } catch (error) {
            res.status(500).send({ message: 'Error updating parcel status', error: error.message });
        }
    }

    async assignRiderToParcel(req, res) {
        try {
            const { riderId, riderName, riderEmail, trackingId } = req.body;
            const id = req.params.id;

            const parcel = await this.Parcel.findById(id);
            if (!parcel) {
                return res.status(404).send({ message: 'parcel not found' });
            }

            const current = normalizeStatus(parcel.deliveryStatus);
            if (current !== STATUS.PAID) {
                return res.status(400).send({ message: 'Parcel is not waiting for rider assignment' });
            }

            const updatedDoc = {
                deliveryStatus: STATUS.READY_TO_PICKUP,
                riderId,
                riderName,
                riderEmail
            };

            const result = await this.Parcel.update(id, updatedDoc);
            await this.Rider.updateWorkStatus(riderId, 'in_delivery');
            logTracking(this.collections.trackings, trackingId || parcel.trackingId, STATUS.READY_TO_PICKUP);

            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error assigning rider to parcel', error: error.message });
        }
    }

    async deleteParcel(req, res) {
        try {
            const id = req.params.id;
            const parcel = await this.Parcel.findById(id);

            if (!parcel) {
                return res.status(404).send({ message: 'parcel not found' });
            }

            const currentUser = await this.User.findByEmail(req.decoded_email);
            const isAdmin = currentUser && currentUser.role === 'admin';
            const isOwner = parcel.senderEmail === req.decoded_email;
            const isUnpaid = parcel.paymentStatus !== 'paid';

            if (!isAdmin && !(isOwner && isUnpaid)) {
                return res.status(403).send({ message: 'forbidden access' });
            }

            const result = await this.Parcel.delete(id);
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: 'Error deleting parcel', error: error.message });
        }
    }
}

module.exports = ParcelController;
