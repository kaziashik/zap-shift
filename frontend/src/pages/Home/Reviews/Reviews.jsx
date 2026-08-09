import React from 'react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ReviewCard from './ReviewCard';
import SectionHeader from '../../../components/ui/SectionHeader';

const Reviews = ({ reviews = [] }) => {
    return (
        <section className="py-16">
            <SectionHeader
                eyebrow="Testimonials"
                title="What customers say"
                subtitle="Delivery experiences from businesses and households using ZapShift every day."
            />

            <Swiper
                loop={true}
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={1}
                breakpoints={{
                    768: { slidesPerView: 2 },
                    1100: { slidesPerView: 3 }
                }}
                coverflowEffect={{
                    rotate: 18,
                    stretch: '30%',
                    depth: 160,
                    modifier: 1,
                    scale: 0.88,
                    slideShadows: false,
                }}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={true}
                modules={[EffectCoverflow, Pagination, Autoplay]}
                className="mySwiper"
            >
                {reviews.map((review) => (
                    <SwiperSlide key={review.id}>
                        <ReviewCard review={review} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Reviews;
