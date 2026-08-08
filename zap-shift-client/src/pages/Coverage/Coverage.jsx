import React, { useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Link, useLoaderData } from 'react-router';
import L from 'leaflet';
import SectionHeader from '../../components/ui/SectionHeader';

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const Coverage = () => {
    const position = [23.6850, 90.3563];
    const serviceCenters = useLoaderData() || [];
    const mapRef = useRef(null);
    const [query, setQuery] = useState('');
    const [message, setMessage] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        const location = query.trim();
        if (!location) {
            setMessage('Type a district or area name to search.');
            return;
        }

        const district = serviceCenters.find((c) =>
            String(c.district || '').toLowerCase().includes(location.toLowerCase()) ||
            String(c.city || '').toLowerCase().includes(location.toLowerCase()) ||
            (c.covered_area || []).some((area) => area.toLowerCase().includes(location.toLowerCase()))
        );

        if (!district) {
            setMessage(`No service center found for "${location}".`);
            return;
        }

        const coord = [district.latitude, district.longitude];
        mapRef.current?.flyTo(coord, 12);
        setMessage(`Showing ${district.district} service center.`);
    };

    return (
        <div className="space-y-6 pb-10">
            <SectionHeader
                eyebrow="Coverage"
                title="We are available in 64 districts"
                subtitle="Search a district or area, then open a service center for pickup and delivery details."
            />

            <form onSubmit={handleSearch} className="zs-surface flex flex-col gap-3 p-4 sm:flex-row">
                <label htmlFor="coverage-search" className="sr-only">Search coverage</label>
                <input
                    id="coverage-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="zs-input"
                    placeholder="Search district, city, or area (e.g. Mirpur)"
                />
                <button type="submit" className="zs-btn-primary shrink-0">Search map</button>
            </form>
            {message && <p className="text-sm font-medium text-secondary dark:text-primary">{message}</p>}

            <div className="zs-surface overflow-hidden p-2">
                <div className="h-[520px] w-full overflow-hidden rounded-2xl md:h-[700px]">
                    <MapContainer
                        center={position}
                        zoom={7}
                        scrollWheelZoom={false}
                        className="h-full w-full"
                        ref={mapRef}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {serviceCenters.map((center, index) => {
                            const slug = encodeURIComponent(`${center.region}-${center.district}`.toLowerCase());
                            return (
                                <Marker
                                    key={`${center.district}-${index}`}
                                    position={[center.latitude, center.longitude]}
                                    icon={markerIcon}
                                >
                                    <Popup>
                                        <strong>{center.district}</strong>
                                        <br />
                                        Areas: {(center.covered_area || []).join(', ')}.
                                        <br />
                                        <Link to={`/coverage/${slug}`}>View details</Link>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default Coverage;
