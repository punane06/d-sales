
import Image from 'next/image';
import { content } from '@/config/content';

export default function EmpathySection(): JSX.Element {
  return (
    <section aria-labelledby="empathy-heading" className="section-shell bg-white">
      <div className="section-container-narrow section-stack-compact">
        <h2 id="empathy-heading" className="section-title">
          {content.empathy.heading}
        </h2>
        <p className="lead-copy">{content.empathy.intro}</p>

        <div className="body-copy space-y-5">
          <p>{content.empathy.story[0]}</p>
          <div className="my-4 flex justify-center">
            <div className="bg-white rounded-2xl overflow-hidden max-w-md w-full flex items-center justify-center">
              <Image
                src="/media/products/empathy.webp"
                alt="Empathy section illustration"
                width={480}
                height={180}
                className="object-contain w-full h-auto"
                priority={false}
              />
            </div>
          </div>
          {content.empathy.story.slice(1).map((paragraph: string) => {
            let text = paragraph;
            text = text.replace(
              'De repente, te conviertes en la "enferma" de la mesa.',
              '<strong>De repente, te conviertes en la "enferma" de la mesa.</strong>'
            );
            text = text.replace(
              'pero se equivoca rotundamente en el menú.',
              '<strong>pero se equivoca rotundamente en el menú.</strong>'
            );
            text = text.replace(
              'El Plato Seguro.',
              '<strong>El Plato Seguro.</strong>'
            );
            return <p key={paragraph} dangerouslySetInnerHTML={{ __html: text }} />;
          })}
        </div>
      </div>
    </section>
  );
}
