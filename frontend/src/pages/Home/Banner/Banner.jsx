import React from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import bannerImg1 from '../../../assets/banner/banner1.png';
import bannerImg2 from '../../../assets/banner/banner2.png';
import bannerImg3 from '../../../assets/banner/banner3.png';
import riderGif from '../../../assets/running.gif';

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

/**
 * Shows only the RIGHT half of each banner PNG (illustration),
 * so baked-in marketing text on the left never appears.
 */
const BannerArt = ({ slide, active, variant }) => (
    <div
        className={`relative overflow-hidden bg-[#EAF6D4] ${
            variant === 'desktop'
                ? 'hidden h-full min-h-[420px] lg:block'
                : 'h-56 border-t border-white/10 md:h-64 lg:hidden'
        }`}
    >
        <AnimatePresence mode="wait">
            <motion.div
                key={`${variant}-${active}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 overflow-hidden"
            >
                <img
                    src={slide.image}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    className="pointer-events-none absolute top-0 h-full w-[200%] max-w-none select-none object-cover object-left"
                    style={{ left: '-100%' }}
                />
            </motion.div>
        </AnimatePresence>
    </div>
);

/** Letter-by-letter reveal with a rider racing left → right through the title */
const RiderHeadline = ({ text, slideKey }) => {
    const reduceMotion = useReducedMotion();
    const chars = Array.from(text);
    const letterDelay = 0.028;
    const rideDuration = Math.max(1.1, chars.length * letterDelay + 0.35);

    if (reduceMotion) {
        return (
            <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
                {text}
            </h1>
        );
    }

    return (
        <h1
            className="relative text-3xl font-extrabold leading-tight md:text-5xl"
            aria-label={text}
        >
            {/* Rider races across the headline */}
            <motion.span
                key={`rider-${slideKey}`}
                className="pointer-events-none absolute -top-7 z-20 inline-flex select-none md:-top-9"
                initial={{ left: '-8%', opacity: 0 }}
                animate={{ left: '102%', opacity: [0, 1, 1, 0] }}
                transition={{
                    duration: rideDuration,
                    ease: [0.22, 1, 0.36, 1],
                    opacity: { times: [0, 0.08, 0.88, 1], duration: rideDuration }
                }}
                aria-hidden="true"
            >
                <img
                    src={riderGif}
                    alt=""
                    className="h-8 w-auto drop-shadow-md md:h-10"
                    draggable={false}
                />
            </motion.span>

            <span className="relative z-10 inline" aria-hidden="true">
                {chars.map((char, index) => (
                    <motion.span
                        key={`${slideKey}-${index}-${char}`}
                        className="inline-block"
                        initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{
                            duration: 0.32,
                            delay: index * letterDelay,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                        style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                ))}
            </span>
        </h1>
    );
};

const Banner = () => {
    const [active, setActive] = React.useState(0);
    const reduceMotion = useReducedMotion();

    React.useEffect(() => {
        const timer = setInterval(() => setActive((prev) => (prev + 1) % slides.length), 6500);
        return () => clearInterval(timer);
    }, []);

    const slide = slides[active];

    return (
        <section className="w-full overflow-hidden bg-secondary">
            <div className="grid w-full lg:h-[68vh] lg:max-h-[720px] lg:min-h-[480px] lg:grid-cols-2">
                <div className="relative z-20 flex flex-col justify-center bg-secondary px-6 py-10 md:px-10 lg:px-14 xl:px-20">
                    <div className="pointer-events-none absolute inset-0 opacity-30 zs-hero-grid" aria-hidden />
                    <div className="relative z-10 max-w-xl text-white">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                            ZapShift Logistics
                        </p>

                        <div className="mt-4 space-y-4">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`title-${active}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className="pt-8 md:pt-10"
                                >
                                    <RiderHeadline text={slide.title} slideKey={active} />
                                </motion.div>
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={`text-${active}`}
                                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.35, delay: reduceMotion ? 0 : 0.35 }}
                                    className="max-w-lg text-base text-white/85 md:text-lg"
                                >
                                    {slide.text}
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link to="/send-parcel" className="zs-btn-primary">Send a Parcel</Link>
                            <Link
                                to="/explore"
                                className="btn rounded-xl border-white/30 bg-white/10 font-semibold text-white hover:bg-white/20"
                            >
                                Explore Services
                            </Link>
                        </div>

                        <div className="mt-8 flex gap-2">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    aria-label={`Go to slide ${index + 1}`}
                                    aria-current={index === active}
                                    onClick={() => setActive(index)}
                                    className={`h-2.5 rounded-full transition-all ${
                                        index === active ? 'w-8 bg-primary' : 'w-2.5 bg-white/40 hover:bg-white/65'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <BannerArt slide={slide} active={active} variant="desktop" />
            </div>

            <BannerArt slide={slide} active={active} variant="mobile" />
        </section>
    );
};

export default Banner;
