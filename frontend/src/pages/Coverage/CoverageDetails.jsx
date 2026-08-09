import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router';
import StatusBadge from '../../components/Dashboard/StatusBadge';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import serviceCentersData from '../../data/serviceCenters.json';

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const CoverageDetails = () => {
    const centers = serviceCentersData || [];
    const { slug } = useParams();

    const center = useMemo(() => {
        return centers.find(
            (c) => `${c.region}-${c.district}`.toLowerCase() === decodeURIComponent(slug).toLowerCase()
        );
    }, [centers, slug]);

    if (!center) {
        return (
            <div className="zs-surface mx-auto my-16 max-w-xl p-8 text-center">
                <h1 className="text-2xl font-bold">Service center not found</h1>
                <Link to="/coverage" className="zs-btn-primary mt-6">Back to Coverage</Link>
            </div>
        );
    }

    const related = centers
        .filter((c) => c.region === center.region && c.district !== center.district)
        .slice(0, 3);

    return (
        <div className="space-y-8 pb-12">
            <section className="zs-surface p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/60">{center.region} Region</p>
                        <h1 className="mt-2 text-3xl font-bold text-secondary dark:text-primary md:text-4xl">
                            {center.district} Service Center
                        </h1>
                        <p className="mt-2 text-base-content/70">City hub: {center.city}</p>
                    </div>
                    <StatusBadge status={center.status || 'active'} />
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <div className="zs-surface overflow-hidden p-2">
                    <div className="h-80 overflow-hidden rounded-2xl">
                        <MapContainer
                            center={[center.latitude, center.longitude]}
                            zoom={10}
                            scrollWheelZoom={false}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; OpenStreetMap'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[center.latitude, center.longitude]} icon={markerIcon}>
                                <Popup>{center.district} Service Center</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
                <div className="zs-surface p-6">
                    <h2 className="text-xl font-bold text-secondary dark:text-primary">Overview</h2>
                    <p className="mt-3 text-base-content/75">
                        The {center.district} hub handles pickup coordination, inter-district routing, and last-mile assignment
                        for parcels moving through the {center.region} region.
                    </p>
                    <h3 className="mt-6 font-bold">Covered areas</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {(center.covered_area || []).map((area) => (
                            <span key={area} className="rounded-full bg-base-200 px-3 py-1 text-sm font-medium">{area}</span>
                        ))}
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl bg-base-200 p-4">
                            <p className="text-xs uppercase tracking-wide text-base-content/60">Latitude</p>
                            <p className="font-semibold">{center.latitude}</p>
                        </div>
                        <div className="rounded-xl bg-base-200 p-4">
                            <p className="text-xs uppercase tracking-wide text-base-content/60">Longitude</p>
                            <p className="font-semibold">{center.longitude}</p>
                        </div>
                    </div>
                    <Link to="/send-parcel" className="zs-btn-primary mt-6">Book pickup here</Link>
                </div>
            </section>

            {!!related.length && (
                <section>
                    <h2 className="mb-4 text-xl font-bold">Related centers in {center.region}</h2>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {related.map((item) => {
                            const itemSlug = encodeURIComponent(`${item.region}-${item.district}`.toLowerCase());
                            return (
                                <Link key={item.district} to={`/coverage/${itemSlug}`} className="zs-card">
                                    <h3 className="font-bold">{item.district}</h3>
                                    <p className="mt-2 text-sm text-base-content/70">{(item.covered_area || []).length} covered areas</p>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
};

export default CoverageDetails;
