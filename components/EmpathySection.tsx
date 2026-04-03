import Image from 'next/image';
import { content } from '@/config/content';

export default function EmpathySection(): JSX.Element {
  return (
    <section aria-label="Empatia" className="bg-white px-4 py-14">
      <div className="mx-auto max-w-4xl space-y-6">
        <h2 className="font-heading text-3xl font-bold leading-tight md:text-5xl">
          {content.empathy.heading}
        </h2>
        <p className="text-lg font-semibold md:text-xl">{content.empathy.intro}</p>

        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
          <div className="space-y-5 text-base leading-relaxed md:text-lg">
            {content.empathy.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mx-auto w-full max-w-sm md:mx-0">
            <Image
              src="/media/products/empathy-cooking.png"
              alt={content.empathy.imageAlt}
              width={360}
              height={420}
              className="h-auto w-full rounded-2xl object-cover shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
