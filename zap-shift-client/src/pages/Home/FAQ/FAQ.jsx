import React from 'react';
import SectionHeader from '../../../components/ui/SectionHeader';
import { faqs } from '../../../data/services';

const FAQ = () => {
    return (
        <section className="py-16">
            <SectionHeader
                eyebrow="FAQ"
                title="Answers before you ship"
                subtitle="Common questions about pricing, tracking, riders, and coverage."
            />
            <div className="mx-auto max-w-3xl space-y-3">
                {faqs.map((item) => (
                    <div key={item.q} className="collapse collapse-arrow zs-surface">
                        <input type="radio" name="zapshift-faq" />
                        <div className="collapse-title font-semibold text-secondary dark:text-primary">{item.q}</div>
                        <div className="collapse-content text-sm text-base-content/70">{item.a}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQ;
