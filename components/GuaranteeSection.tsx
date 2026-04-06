import { content } from '@/config/content';

export default function GuaranteeSection(): JSX.Element {
  return (
    <section aria-labelledby="guarantee-heading" className="section-shell bg-charcoal text-white">
      <div className="section-container section-stack">
        <h2 id="guarantee-heading" className="section-title">
          {content.guarantee.heading}
        </h2>
        <p className="body-copy" dangerouslySetInnerHTML={{ __html: content.guarantee.text }} />

        <article className="rounded-2xl bg-white/10 p-6">
          <h3 className="subsection-title">
            {content.guarantee.trustHeading}
          </h3>
          <p className="body-copy mt-3">{content.guarantee.trustText}</p>
        </article>
      </div>
    </section>
  );
}
