import React from 'react';
import Banner from '../Banner/Banner';
import Brands from '../Brands/Brands';
import Reviews from '../Reviews/Reviews';
import HowItWorks from '../HowItWorks/HowItWorks';
import Features from '../Features/Features';
import ServicesPreview from '../ServicesPreview/ServicesPreview';
import Stats from '../Stats/Stats';
import Pricing from '../Pricing/Pricing';
import FAQ from '../FAQ/FAQ';
import CTA from '../CTA/CTA';
import Newsletter from '../Newsletter/Newsletter';
import SectionHeader from '../../../components/ui/SectionHeader';
import reviewsData from '../../../data/reviews.json';

const Home = () => {
    return (
        <div className="pb-8">
            <Banner />
            <Stats />
            <Features />
            <HowItWorks />
            <ServicesPreview />
            <Pricing />
            <section className="py-10">
                <SectionHeader
                    eyebrow="Partners"
                    title="Teams that ship with ZapShift"
                    subtitle="E-commerce, retail, and office networks moving parcels every day."
                />
                <div className="zs-surface px-4 py-6">
                    <Brands />
                </div>
            </section>
            <Reviews reviews={reviewsData} />
            <FAQ />
            <Newsletter />
            <CTA />
        </div>
    );
};

export default Home;
