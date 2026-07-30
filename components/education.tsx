import { GraduationCap } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { education } from '@/content/experience'

export function Education() {
  return (
    <section
      id="education"
      className="border-border relative scroll-mt-24 border-t py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Education"
          title="Where I am studying"
          description="Currently working towards a degree while building in public."
        />

        <Reveal
          spotlight
          className="glass mt-14 rounded-3xl p-6 sm:p-8 lg:max-w-3xl"
        >
          <div className="flex items-start gap-4">
            <span className="bg-primary/12 text-primary ring-primary/25 grid size-11 shrink-0 place-items-center rounded-2xl ring-1">
              <GraduationCap className="size-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-medium">{education.field}</h3>
              <p className="text-primary text-sm">{education.institution}</p>
              <p className="text-muted-foreground mt-1 font-mono text-xs">
                {education.year} · {education.status}
              </p>
            </div>
          </div>

          <p className="text-muted-foreground mt-6 leading-relaxed">
            {education.body}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
