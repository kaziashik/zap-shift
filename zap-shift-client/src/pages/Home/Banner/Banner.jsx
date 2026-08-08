import React from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import bannerImg1 from '../../../assets/banner/banner1.png';
import bannerImg2 from '../../../assets/banner/banner2.png';
import bannerImg3 from '../../../assets/banner/banner3.png';

const slides = [
    {
        image: bannerImg1,
        title: 'Pickup from home. Delivered with proof.',
        text: 'Book parcels in minutes, pay securely, and track every mile across Bangladesh.'
    },
    {
        image: bannerImg2,
        title: 'Nationwide hubs. Local riders.',
        text: '64 district service centers connect same-city speed with inter-district reliability.'
    },
    {
        image: bannerImg3,
        title: 'Built for users, admins, and riders.',
        text: 'One platform for booking, assignment, pickup confirmation, and final delivery.'
    }
];

const Banner = () => {
    const [active, setActive] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => setActive((prev) => (prev + 1) % slides.length), 4500);
        return () => clearInterval(timer);
    }, []);

    const slide = slides[active];

    return (
        <section className="relative overflow-hidden rounded-3xl zs-hero-grid">
            <div className="absolute inset-0">
                <AnimatePresence mode="sync">
                    <motion.img
                        key={slide.image}
                        src={slide.image}
                        alt=""
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/75 to-secondary/30" />
            </div>

            <div className="relative z-10 flex h-[62vh] min-h-[420px] max-h-[640px] items-center px-6 py-10 md:px-12">
                <div className="max-w-2xl text-white">
                    <motion.p
                        key={`eyebrow-${active}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm font-semibold uppercase tracking-[0.22em] text-primary"
                    >
                        ZapShift Logistics
                    </motion.p>
                    <motion.h1
                        key={`title-${active}`}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl"
                    >
                        {slide.title}
                    </motion.h1>
                    <motion.p
                        key={`text-${active}`}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 max-w-xl text-white/85 md:text-lg"
                    >
                        {slide.text}
                    </motion.p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link to="/send-parcel" className="zs-btn-primary">Send a Parcel</Link>
                        <Link to="/explore" className="btn rounded-xl border-white/30 bg-white/10 font-semibold text-white backdrop-blur hover:bg-white/20">
                            Explore Services
                        </Link>
                    </div>
                    <div className="mt-8 flex gap-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                aria-label={`Go to slide ${index + 1}`}
                                onClick={() => setActive(index)}
                                className={`h-2.5 rounded-full transition-all ${index === active ? 'w-8 bg-primary' : 'w-2.5 bg-white/40'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
