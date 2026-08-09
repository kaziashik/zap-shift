const crypto = require('crypto');

/** Spec workflow statuses */
const STATUS = {
    UNPAID: 'unpaid',
    PAID: 'paid',
    READY_TO_PICKUP: 'ready-to-pickup',
    IN_TRANSIT: 'in-transit',
    READY_FOR_DELIVERY: 'ready-for-delivery',
    REACHED_WAREHOUSE: 'reached-warehouse',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered'
};

/** Map legacy statuses → canonical */
const LEGACY_MAP = {
    'pending-pickup': STATUS.PAID,
    driver_assigned: STATUS.READY_TO_PICKUP,
    rider_arriving: STATUS.READY_TO_PICKUP,
    parcel_picked_up: STATUS.IN_TRANSIT,
    parcel_delivered: STATUS.DELIVERED
};

function normalizeStatus(status) {
    if (!status) return STATUS.UNPAID;
    return LEGACY_MAP[status] || status;
}

function generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

function hashOtp(otp) {
    return crypto.createHash('sha256').update(String(otp)).digest('hex');
}

function verifyOtp(otp, otpHash) {
    if (!otp || !otpHash) return false;
    return hashOtp(otp) === otpHash;
}

/**
 * Allowed next statuses from current (normalized), by same-city vs outside.
 */
function getAllowedNextStatuses(currentStatus, sameCity) {
    const current = normalizeStatus(currentStatus);

    switch (current) {
        case STATUS.READY_TO_PICKUP:
            return [STATUS.IN_TRANSIT];
        case STATUS.IN_TRANSIT:
            return sameCity
                ? [STATUS.READY_FOR_DELIVERY]
                : [STATUS.REACHED_WAREHOUSE];
        case STATUS.REACHED_WAREHOUSE:
            return [STATUS.SHIPPED];
        case STATUS.SHIPPED:
            return [STATUS.READY_FOR_DELIVERY];
        case STATUS.READY_FOR_DELIVERY:
            return [STATUS.DELIVERED];
        default:
            return [];
    }
}

function canTransition(currentStatus, nextStatus, sameCity) {
    const next = normalizeStatus(nextStatus);
    return getAllowedNextStatuses(currentStatus, sameCity).includes(next);
}

const ACTIVE_STATUSES = [
    STATUS.READY_TO_PICKUP,
    STATUS.IN_TRANSIT,
    STATUS.READY_FOR_DELIVERY,
    STATUS.REACHED_WAREHOUSE,
    STATUS.SHIPPED,
    // legacy
    'driver_assigned',
    'rider_arriving',
    'parcel_picked_up'
];

const COMPLETED_STATUSES = [STATUS.DELIVERED, 'parcel_delivered'];

module.exports = {
    STATUS,
    LEGACY_MAP,
    normalizeStatus,
    generateOtp,
    hashOtp,
    verifyOtp,
    getAllowedNextStatuses,
    canTransition,
    ACTIVE_STATUSES,
    COMPLETED_STATUSES
};
