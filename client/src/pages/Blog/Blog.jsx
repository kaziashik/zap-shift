import React from 'react';
import { Link } from 'react-router';
import SectionHeader from '../../components/ui/SectionHeader';
import { blogs } from '../../data/services';

const Blog = () => {
    return (
        <div className="pb-12">
            <SectionHeader
                eyebrow="Blog"
                title="Logistics insights from ZapShift"
                subtitle="Guides and operations notes for senders, riders, and growing businesses."
            />
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {blogs.map((post) => (
                    <article key={post.id} className="zs-card">
                        <img src={post.image} alt={post.title} className="h-40 w-full rounded-xl object-cover" />
                        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-base-content/60">
                            <span>{post.category}</span>
                            <span>•</span>
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                        </div>
                        <h3 className="mt-2 text-lg font-bold text-secondary dark:text-primary">{post.title}</h3>
                        <p className="mt-2 line-clamp-3 text-sm text-base-content/70">{post.excerpt}</p>
                        <Link to={`/blog/${post.id}`} className="zs-btn-primary btn-sm mt-auto">
                            View Details
                        </Link>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default Blog;
