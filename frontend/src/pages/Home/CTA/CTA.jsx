import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';

const CTA = () => {
    return (
        <section className="w-full py-0">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full bg-gradient-to-r from-secondary via-accent to-secondary px-4 py-14 text-center text-white md:px-6 lg:px-8 xl:px-10"
            >
                <h2 className="text-3xl font-bold md:text-4xl">Ready to move your next parcel?</h2>
                <p className="mx-auto mt-3 max-w-2xl text-white/80">
                    Create a booking, pay securely, and let ZapShift riders handle pickup to doorstep delivery.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link to="/send-parcel" className="zs-btn-primary">Book a Parcel</Link>
                    <Link to="/contact" className="btn rounded-xl border-white/30 bg-white/10 font-semibold text-white hover:bg-white/20">
                        Talk to Support
                    </Link>
                </div>
            </motion.div>
        </section>
    );
};

export default CTA;
