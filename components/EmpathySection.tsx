import { content } from '@/config/content';

export default function EmpathySection(): JSX.Element {
  return (
    <section aria-labelledby="empathy-heading" className="section-shell bg-white">
      <div className="section-container-narrow space-y-6">
        <h2 id="empathy-heading" className="section-title">
          {content.empathy.heading}
        </h2>
        <p className="text-lg font-semibold md:text-xl">{content.empathy.intro}</p>

        <div className="body-copy space-y-5">
          {content.empathy.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
