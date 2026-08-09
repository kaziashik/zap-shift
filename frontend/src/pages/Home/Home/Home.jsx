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
import TrackLookup from '../TrackLookup/TrackLookup';
import AmbientBg from '../AmbientBg/AmbientBg';
import SectionHeader from '../../../components/ui/SectionHeader';
import reviewsData from '../../../data/reviews.json';

const Home = () => {
    return (
        <div className="relative w-full pb-0">
            <AmbientBg />

            <div className="relative z-[1] w-full">
                <Banner />
                <Stats />

                <div className="w-full space-y-2 px-4 md:px-6 lg:px-8 xl:px-10">
                    <Features />
                </div>

                {/* Live tracking — directly after Features */}
                <TrackLookup />

                <div className="w-full space-y-2 px-4 md:px-6 lg:px-8 xl:px-10">
                    <HowItWorks />
                    <ServicesPreview />
                    <Pricing />
                </div>

                {/* Full-bleed partners strip with small side gaps */}
                <section className="w-full py-12 md:py-14">
                    <div className="px-4 md:px-6 lg:px-8 xl:px-10">
                        <SectionHeader
                            eyebrow="Partners"
                            title="Teams that ship with ZapShift"
                            subtitle="E-commerce, retail, and office networks moving parcels every day."
                        />
                    </div>
                    <div className="w-full px-2 sm:px-3 md:px-4">
                        <div className="zs-surface overflow-hidden rounded-2xl px-2 py-6 sm:rounded-3xl sm:px-3 md:py-8 lg:px-4">
                            <Brands />
                        </div>
                    </div>
                </section>

                <div className="w-full space-y-2 px-4 md:px-6 lg:px-8 xl:px-10">
                    <Reviews reviews={reviewsData} />
                    <FAQ />
                </div>

                <CTA />
            </div>
        </div>
    );
};

export default Home;
