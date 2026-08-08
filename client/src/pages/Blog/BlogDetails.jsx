import React from 'react';
import { Link, useParams } from 'react-router';
import { blogs } from '../../data/services';

const BlogDetails = () => {
    const { id } = useParams();
    const post = blogs.find((b) => b.id === id);
    const related = blogs.filter((b) => b.id !== id).slice(0, 2);

    if (!post) {
        return (
            <div className="zs-surface mx-auto my-16 max-w-xl p-8 text-center">
                <h1 className="text-2xl font-bold">Article not found</h1>
                <Link to="/blog" className="zs-btn-primary mt-6">Back to Blog</Link>
            </div>
        );
    }

    return (
        <article className="mx-auto max-w-3xl space-y-6 pb-12">
            <img src={post.image} alt={post.title} className="h-64 w-full rounded-3xl object-cover md:h-80" />
            <div>
                <p className="text-sm font-semibold text-base-content/60">{post.category} · {post.date} · {post.readTime}</p>
                <h1 className="mt-2 text-3xl font-bold text-secondary dark:text-primary md:text-4xl">{post.title}</h1>
            </div>
            <div className="zs-surface p-6">
                <h2 className="text-xl font-bold">Overview</h2>
                <p className="mt-3 text-base-content/75">{post.excerpt}</p>
                <p className="mt-4 leading-relaxed text-base-content/80">{post.content}</p>
            </div>
            {!!related.length && (
                <section>
                    <h2 className="mb-3 text-xl font-bold">Related articles</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {related.map((item) => (
                            <Link key={item.id} to={`/blog/${item.id}`} className="zs-card">
                                <h3 className="font-bold">{item.title}</h3>
                                <p className="mt-2 text-sm text-base-content/70">{item.excerpt}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </article>
    );
};

export default BlogDetails;
