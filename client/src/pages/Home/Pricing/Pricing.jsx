import React from 'react';
import { Link } from 'react-router';
import SectionHeader from '../../../components/ui/SectionHeader';

const rows = [
    { type: 'Document', weight: 'Any', within: '৳60', outside: '৳80' },
    { type: 'Non-Document', weight: 'Up to 3kg', within: '৳110', outside: '৳150' },
    { type: 'Non-Document', weight: '> 3kg', within: '+৳40/kg', outside: '+৳40/kg + ৳40' }
];

const Pricing = () => {
    return (
        <section className="py-16">
            <SectionHeader
                eyebrow="Pricing"
                title="Clear rates before you book"
                subtitle="Dynamic pricing based on parcel type, weight, and city-to-city distance."
            />
            <div className="zs-surface overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead className="bg-secondary text-primary">
                            <tr>
                                <th>Parcel Type</th>
                                <th>Weight</th>
                                <th>Within City</th>
                                <th>Outside City</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr key={`${row.type}-${row.weight}`}>
                                    <td className="font-semibold">{row.type}</td>
                                    <td>{row.weight}</td>
                                    <td>{row.within}</td>
                                    <td>{row.outside}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-6 text-center">
                <Link to="/send-parcel" className="zs-btn-primary">Calculate & book</Link>
            </div>
        </section>
    );
};

export default Pricing;
