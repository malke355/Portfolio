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
    <Reveal variant="blur" className={cn('max-w-2xl', className)}>
      <p className="text-primary text-sm font-medium tracking-wide">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
        {title}
      </h2>
      <span
        aria-hidden
        className="bg-primary/70 mt-4 block h-0.5 w-12 origin-left rounded-full transition-transform duration-700 ease-out"
      />
      {description ? (
        <p className="text-muted-foreground mt-4 max-w-xl text-base leading-relaxed text-pretty sm:text-lg">
          {description}
        </p>
      ) : null}
    </Reveal>
  )
}
