import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal className={cn('max-w-2xl', className)}>
      <span className="text-primary inline-flex items-center gap-2 font-mono text-xs tracking-[0.25em] uppercase">
        <span aria-hidden className="bg-primary/50 h-px w-8" />
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-muted-foreground mt-4 leading-relaxed text-pretty">
          {description}
        </p>
      ) : null}
    </Reveal>
  )
}
