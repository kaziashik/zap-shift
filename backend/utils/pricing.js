/**
 * ZapShift pricing (BDT)
 * Document: 60 within city / 80 outside
 * Non-document ≤3kg: 110 / 150
 * Non-document >3kg: +40/kg within; +40/kg +40 outside
 */
function calculateParcelCost({ parcelType, parcelWeight, senderDistrict, receiverDistrict }) {
    const isDocument = String(parcelType || '').toLowerCase() === 'document';
    const isSameDistrict = senderDistrict === receiverDistrict;
    const weight = parseFloat(parcelWeight) || 0;

    if (isDocument) {
        return isSameDistrict ? 60 : 80;
    }

    if (weight <= 3) {
        return isSameDistrict ? 110 : 150;
    }

    const minCharge = isSameDistrict ? 110 : 150;
    const extraWeight = weight - 3;
    const extraCharge = isSameDistrict ? extraWeight * 40 : extraWeight * 40 + 40;
    return Math.round(minCharge + extraCharge);
}

function isSameCityParcel(parcel) {
    return parcel?.senderDistrict && parcel.senderDistrict === parcel.receiverDistrict;
}

/** Rider commission: 80% same city, 60% outside */
function calculateRiderPayout(parcel) {
    const cost = Number(parcel?.cost) || 0;
    const rate = isSameCityParcel(parcel) ? 0.8 : 0.6;
    return Math.round(cost * rate);
}

module.exports = {
    calculateParcelCost,
    isSameCityParcel,
    calculateRiderPayout
};
