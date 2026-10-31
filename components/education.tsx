import { GraduationCap } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { education } from '@/content/experience'

export function Education() {
  return (
    <section
      id="education"
      data-scroll-scene
      className="border-border relative scroll-mt-24 overflow-hidden border-t py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Education"
          title="Where I am studying"
          description="Currently working towards a degree while building in public."
        />

        <Reveal
          variant="scale"
          spotlight
          className="surface card-lift group mt-12 max-w-3xl rounded-2xl p-6 shadow-sm sm:p-8"
        >
          <div className="flex items-start gap-4">
            <span className="bg-accent text-accent-foreground grid size-11 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <GraduationCap className="size-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-medium tracking-tight">
                {education.field}
              </h3>
              <p className="text-primary mt-1 text-sm font-medium">
                {education.institution}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {education.year}
              </p>
            </div>
          </div>

          <p className="text-muted-foreground mt-6 text-[15px] leading-relaxed">
            {education.body}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
