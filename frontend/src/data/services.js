import { FaTruck, FaWarehouse, FaClock, FaShieldAlt, FaMapMarkedAlt, FaHeadset } from 'react-icons/fa';

export const services = [
    {
        id: 'same-city',
        title: 'Same City Delivery',
        description: 'Door-to-door pickup and drop within the same city with same-day slots.',
        priceFrom: 60,
        eta: '4–8 hours',
        rating: 4.9,
        location: 'Major cities',
        image: 'https://images.unsplash.com/photo-1566576721346-d77f162fa1b5?auto=format&fit=crop&w=800&q=80',
        category: 'Delivery',
        features: ['Live tracking', 'OTP confirmation', 'Cashless payment']
    },
    {
        id: 'inter-district',
        title: 'Inter-District Shipping',
        description: 'Secure routing through district service centers for nationwide parcels.',
        priceFrom: 80,
        eta: '24–72 hours',
        rating: 4.8,
        location: '64 districts',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
        category: 'Shipping',
        features: ['Warehouse handoff', 'Status timeline', 'Insured options']
    },
    {
        id: 'document',
        title: 'Document Express',
        description: 'Lightweight document delivery with priority handling and proof of delivery.',
        priceFrom: 60,
        eta: 'Same day',
        rating: 4.9,
        location: 'Nationwide',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
        category: 'Documents',
        features: ['Priority lane', 'Digital POD', 'Business invoices']
    },
    {
        id: 'business',
        title: 'Business Logistics',
        description: 'Bulk booking, dedicated riders, and reporting for growing e-commerce brands.',
        priceFrom: 110,
        eta: 'Custom SLA',
        rating: 4.7,
        location: 'Corporate hubs',
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80',
        category: 'Business',
        features: ['Bulk discounts', 'API-ready flow', 'Account manager']
    },
    {
        id: 'office-pickup',
        title: 'Office Pickup Desk',
        description: 'Scheduled pickups from offices and co-working spaces during business hours.',
        priceFrom: 70,
        eta: 'Next slot',
        rating: 4.8,
        location: 'Metro offices',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        category: 'Pickup',
        features: ['Scheduled slots', 'Multi-parcel', 'Receipt sync']
    },
    {
        id: 'secure',
        title: 'Secure High-Value',
        description: 'Extra verification and careful handling for high-value non-document parcels.',
        priceFrom: 150,
        eta: '24–48 hours',
        rating: 4.9,
        location: 'Select corridors',
        image: 'https://images.unsplash.com/photo-1578574577315-2fdebee81d79?auto=format&fit=crop&w=800&q=80',
        category: 'Secure',
        features: ['Dual verification', 'Priority riders', 'Damage support']
    }
];

export const featureHighlights = [
    { icon: FaTruck, title: 'Door-to-Door', text: 'Pickup from home or office and drop at the receiver address.' },
    { icon: FaMapMarkedAlt, title: '64 District Coverage', text: 'Nationwide reach with active service centers across Bangladesh.' },
    { icon: FaClock, title: 'Real-Time Tracking', text: 'Follow every status change from unpaid booking to delivered.' },
    { icon: FaShieldAlt, title: 'Secure Payments', text: 'Card checkout with unique tracking IDs after successful payment.' },
    { icon: FaWarehouse, title: 'Service Center Routing', text: 'Inter-district parcels move through origin and destination hubs.' },
    { icon: FaHeadset, title: 'Role-Based Ops', text: 'Users book, admins assign, riders execute with clear dashboards.' }
];

export const stats = [
    { label: 'Districts Covered', value: '64' },
    { label: 'Avg. Same-City ETA', value: '6h' },
    { label: 'On-Time Deliveries', value: '98%' },
    { label: 'Active Riders', value: '1.2k+' }
];

export const faqs = [
    {
        q: 'How is parcel cost calculated?',
        a: 'Cost depends on parcel type (document / non-document), weight, and whether origin and destination are in the same city or different districts.'
    },
    {
        q: 'When do I get a tracking number?',
        a: 'After successful payment, ZapShift generates a unique tracking ID and creates the first tracking timeline entry.'
    },
    {
        q: 'Can I become a rider?',
        a: 'Yes. Submit a rider application from Be a Rider. Admins approve or reject applications, then assign pickup and delivery tasks.'
    },
    {
        q: 'Do you deliver outside Dhaka?',
        a: 'Yes. Outside-city parcels are routed through origin and destination service centers before final delivery.'
    },
    {
        q: 'How do I contact support?',
        a: 'Use the Contact page or email support@zapshift.com. Our ops team responds during business hours.'
    }
];

export const blogs = [
    {
        id: 'door-to-door-guide',
        title: 'Door-to-Door Delivery Checklist for SMEs',
        excerpt: 'Practical steps for packaging, labeling, and booking parcels that move faster through ZapShift hubs.',
        date: '2026-07-12',
        category: 'Guides',
        readTime: '5 min',
        image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80',
        content: 'Successful door-to-door logistics starts before a rider arrives. Seal parcels properly, keep receiver contacts accurate, and choose the correct service center region. ZapShift then calculates pricing, issues tracking after payment, and keeps both sender and ops teams aligned through status updates.'
    },
    {
        id: 'rider-safety',
        title: 'How ZapShift Riders Confirm Secure Handoffs',
        excerpt: 'From pickup verification to delivery confirmation, see how riders keep every parcel accountable.',
        date: '2026-06-28',
        category: 'Operations',
        readTime: '4 min',
        image: 'https://images.unsplash.com/photo-1616401784844-554041748bcd?auto=format&fit=crop&w=900&q=80',
        content: 'Riders work with assigned queues for pickup and delivery. Status changes are logged into tracking history so senders can audit movement. Clear address notes and reachable phone numbers remain the biggest factors in first-attempt success rates.'
    },
    {
        id: 'pricing-explained',
        title: 'Understanding ZapShift Pricing Across Districts',
        excerpt: 'A clear breakdown of document vs non-document rates for same-city and outside-city deliveries.',
        date: '2026-06-02',
        category: 'Pricing',
        readTime: '6 min',
        image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=900&q=80',
        content: 'Document parcels start from a flat rate, while non-document parcels scale with weight. Outside-city shipments include hub handling, which is why rates differ from same-city routes. Transparent pricing helps businesses forecast logistics spend.'
    }
];
