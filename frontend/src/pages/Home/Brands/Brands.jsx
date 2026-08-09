import React from 'react';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import amazon from '../../../assets/brands/amazon.png';
import amazon_vector from '../../../assets/brands/amazon_vector.png';
import casio from '../../../assets/brands/casio.png';
import moonstar from '../../../assets/brands/moonstar.png';
import randstad from '../../../assets/brands/randstad.png';
import star from '../../../assets/brands/star.png';
import start_people from '../../../assets/brands/start_people.png';

const brandLogosBase = [
    { src: amazon, name: 'Amazon' },
    { src: amazon_vector, name: 'Amazon' },
    { src: casio, name: 'Casio' },
    { src: moonstar, name: 'Moonstar' },
    { src: randstad, name: 'Randstad' },
    { src: star, name: 'Star' },
    { src: start_people, name: 'Start People' }
];

/* Duplicate for a smoother infinite loop across wide screens */
const brandLogos = [...brandLogosBase, ...brandLogosBase];

const Brands = () => {
    return (
        <div className="relative">
            {/* Soft edge fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-base-100 to-transparent md:w-16" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-base-100 to-transparent md:w-16" aria-hidden="true" />

            <Swiper
                loop
                freeMode
                speed={4500}
                spaceBetween={28}
                grabCursor
                modules={[Autoplay, FreeMode]}
                autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                }}
                breakpoints={{
                    0: { slidesPerView: 2.4, spaceBetween: 16 },
                    480: { slidesPerView: 3.2, spaceBetween: 20 },
                    768: { slidesPerView: 4.5, spaceBetween: 28 },
                    1024: { slidesPerView: 5.5, spaceBetween: 36 },
                    1280: { slidesPerView: 6.5, spaceBetween: 40 }
                }}
                className="brands-marquee py-2"
            >
                {brandLogos.map((logo, index) => (
                    <SwiperSlide key={`${logo.name}-${index}`} className="!h-auto">
                        <div className="flex h-20 items-center justify-center rounded-2xl border border-base-300/70 bg-base-100 px-5 py-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md md:h-24">
                            <img
                                src={logo.src}
                                alt={logo.name}
                                className="max-h-10 w-auto max-w-[8.5rem] object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 md:max-h-12 md:max-w-[10rem]"
                                loading="lazy"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Brands;
