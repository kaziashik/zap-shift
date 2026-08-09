import React from 'react';
import Logo from '../../../components/Logo/Logo';
import { Link } from 'react-router';
import { FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="mt-12 w-full bg-secondary text-white">
            <div className="grid w-full gap-8 px-4 py-12 md:grid-cols-4 md:px-6 lg:px-8 xl:px-10">
                <aside className="space-y-3 md:col-span-1">
                    <div className="[&_h3]:text-white">
                        <Logo />
                    </div>
                    <p className="text-sm leading-relaxed text-white/75">
                        Production-ready door-to-door parcel logistics for homes, offices, and growing businesses across Bangladesh.
                    </p>
                </aside>

                <nav className="space-y-2">
                    <h6 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Product</h6>
                    <Link className="block text-sm text-white/80 hover:text-primary" to="/explore">Services</Link>
                    <Link className="block text-sm text-white/80 hover:text-primary" to="/coverage">Coverage</Link>
                    <Link className="block text-sm text-white/80 hover:text-primary" to="/send-parcel">Send Parcel</Link>
                    <Link className="block text-sm text-white/80 hover:text-primary" to="/rider">Become a Rider</Link>
                </nav>

                <nav className="space-y-2">
                    <h6 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Company</h6>
                    <Link className="block text-sm text-white/80 hover:text-primary" to="/about">About</Link>
                    <Link className="block text-sm text-white/80 hover:text-primary" to="/blog">Blog</Link>
                    <Link className="block text-sm text-white/80 hover:text-primary" to="/contact">Contact</Link>
                    <Link className="block text-sm text-white/80 hover:text-primary" to="/help">Help Center</Link>
                </nav>

                <nav className="space-y-2">
                    <h6 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Contact</h6>
                    <p className="text-sm text-white/80">support@zapshift.com</p>
                    <p className="text-sm text-white/80">Hotline: 16263</p>
                    <p className="text-sm text-white/80">House 12, Road 5, Dhanmondi, Dhaka</p>
                    <div className="flex gap-3 pt-2 text-xl">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-primary"><FaFacebook /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-primary"><FaLinkedin /></a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-primary"><FaYoutube /></a>
                    </div>
                </nav>
            </div>
            <div className="flex w-full flex-col items-center justify-between gap-2 border-t border-white/10 px-4 py-4 text-xs text-white/60 sm:flex-row md:px-6 lg:px-8 xl:px-10">
                <p>Copyright © {new Date().getFullYear()} ZapShift — All rights reserved</p>
                <div className="flex flex-wrap gap-4">
                    <Link to="/privacy" className="hover:text-primary">Privacy</Link>
                    <Link to="/terms" className="hover:text-primary">Terms</Link>
                    <Link to="/help" className="hover:text-primary">Help</Link>
                    <Link to="/contact" className="hover:text-primary">Support</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
