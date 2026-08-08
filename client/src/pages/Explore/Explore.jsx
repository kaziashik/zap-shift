import React, { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import CenterCard from '../../components/CenterCard/CenterCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import { services } from '../../data/services';
import serviceCentersData from '../../data/serviceCenters.json';
import usePagination from '../../hooks/usePagination';

const Explore = () => {
    const centers = serviceCentersData || [];
    const [tab, setTab] = useState('services');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [region, setRegion] = useState('all');
    const [sort, setSort] = useState('featured');
    const [loading, setLoading] = useState(true);

    const categories = useMemo(
        () => ['all', ...new Set(services.map((s) => s.category))],
        []
    );
    const regions = useMemo(
        () => ['all', ...new Set(centers.map((c) => c.region).filter(Boolean))],
        [centers]
    );

    const filteredServices = useMemo(() => {
        let list = [...services];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((s) =>
                s.title.toLowerCase().includes(q) ||
                s.description.toLowerCase().includes(q) ||
                s.location.toLowerCase().includes(q)
            );
        }
        if (category !== 'all') list = list.filter((s) => s.category === category);
        if (sort === 'price-asc') list.sort((a, b) => a.priceFrom - b.priceFrom);
        if (sort === 'price-desc') list.sort((a, b) => b.priceFrom - a.priceFrom);
        if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
        return list;
    }, [search, category, sort]);

    const filteredCenters = useMemo(() => {
        let list = [...centers];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((c) =>
                String(c.district || '').toLowerCase().includes(q) ||
                String(c.city || '').toLowerCase().includes(q) ||
                String(c.region || '').toLowerCase().includes(q) ||
                (c.covered_area || []).some((a) => a.toLowerCase().includes(q))
            );
        }
        if (region !== 'all') list = list.filter((c) => c.region === region);
        if (sort === 'name') list.sort((a, b) => String(a.district).localeCompare(String(b.district)));
        return list;
    }, [centers, search, region, sort]);

    const activeList = tab === 'services' ? filteredServices : filteredCenters;
    const { page, totalPages, paginated, setPage, reset } = usePagination(activeList, 9);

    useEffect(() => {
        reset();
        setLoading(true);
        const t = setTimeout(() => setLoading(false), 400);
        return () => clearTimeout(t);
    }, [tab, search, category, region, sort, reset]);

    return (
        <div className="pb-10">
            <SectionHeader
                eyebrow="Explore"
                title="Services & service centers"
                subtitle="Search, filter, and sort ZapShift delivery options and nationwide coverage hubs."
            />

            <div className="zs-surface mb-6 grid gap-3 p-4 md:grid-cols-4">
                <label className="form-control md:col-span-2">
                    <span className="mb-1 text-sm font-medium">Search</span>
                    <input
                        className="zs-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={tab === 'services' ? 'Search services...' : 'Search district, city, area...'}
                    />
                </label>
                {tab === 'services' ? (
                    <label className="form-control">
                        <span className="mb-1 text-sm font-medium">Category</span>
                        <select className="select select-bordered rounded-xl" value={category} onChange={(e) => setCategory(e.target.value)}>
                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </label>
                ) : (
                    <label className="form-control">
                        <span className="mb-1 text-sm font-medium">Region</span>
                        <select className="select select-bordered rounded-xl" value={region} onChange={(e) => setRegion(e.target.value)}>
                            {regions.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </label>
                )}
                <label className="form-control">
                    <span className="mb-1 text-sm font-medium">Sort</span>
                    <select className="select select-bordered rounded-xl" value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="featured">Featured</option>
                        {tab === 'services' && <option value="price-asc">Price: Low to High</option>}
                        {tab === 'services' && <option value="price-desc">Price: High to Low</option>}
                        {tab === 'services' && <option value="rating">Top Rated</option>}
                        {tab === 'centers' && <option value="name">Name A-Z</option>}
                    </select>
                </label>
            </div>

            <div className="mb-6 flex gap-2">
                <button type="button" className={`btn btn-sm rounded-xl ${tab === 'services' ? 'bg-primary text-secondary' : ''}`} onClick={() => setTab('services')}>
                    Services ({filteredServices.length})
                </button>
                <button type="button" className={`btn btn-sm rounded-xl ${tab === 'centers' ? 'bg-primary text-secondary' : ''}`} onClick={() => setTab('centers')}>
                    Centers ({filteredCenters.length})
                </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                    : tab === 'services'
                        ? paginated.map((service) => <ServiceCard key={service.id} service={service} />)
                        : paginated.map((center) => (
                            <CenterCard key={`${center.region}-${center.district}`} center={center} />
                        ))}
            </div>

            {!loading && !paginated.length && (
                <p className="py-16 text-center text-base-content/60">No results match your filters.</p>
            )}

            {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                    <button type="button" className="btn btn-sm rounded-xl" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                    <span className="text-sm font-semibold">Page {page} of {totalPages}</span>
                    <button type="button" className="btn btn-sm rounded-xl" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
            )}
        </div>
    );
};

export default Explore;
