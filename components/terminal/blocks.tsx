'use client'

import { ArrowUpRight } from 'lucide-react'
import { GithubPanel } from '@/components/terminal/github-panel'
import type { Block, Tone } from '@/lib/terminal/types'
import { cn } from '@/lib/utils'

const tones: Record<Tone, string> = {
  default: 'text-foreground/90',
  muted: 'text-muted-foreground',
  primary: 'text-primary',
  success: 'text-primary',
  error: 'text-destructive',
}

export function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'text':
      return (
        <p
          className={cn(
            'text-[13px] leading-relaxed whitespace-pre-wrap',
            tones[block.tone ?? 'default'],
          )}
        >
          {block.text}
        </p>
      )

    case 'heading':
      return (
        <p className="text-foreground text-sm font-semibold tracking-tight">
          {block.text}
        </p>
      )

    case 'bullets':
      return (
        <ul className="flex flex-col gap-1">
          {block.items.map((item) => (
            <li
              key={item}
              className="text-foreground/85 flex gap-2.5 text-[13px] leading-relaxed"
            >
              <span aria-hidden className="text-primary shrink-0 select-none">
                ›
              </span>
              {item}
            </li>
          ))}
        </ul>
      )

    case 'pairs':
      return (
        <dl className="grid gap-x-4 gap-y-1.5 sm:grid-cols-[minmax(6rem,auto)_1fr]">
          {block.items.map((item) => (
            <div
              key={item.label}
              className="grid gap-x-4 sm:col-span-2 sm:grid-cols-subgrid"
            >
              <dt className="text-primary font-mono text-xs">{item.label}</dt>
              <dd className="text-foreground/85 text-[13px] leading-relaxed">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      )

    case 'tags':
      return (
        <ul className="flex flex-wrap gap-1.5">
          {block.items.map((item) => (
            <li
              key={item}
              className="border-border bg-secondary/50 text-foreground/85 rounded-md border px-2 py-0.5 font-mono text-[11px]"
            >
              {item}
            </li>
          ))}
        </ul>
      )

    case 'link':
      return (
        <a
          href={block.href}
          target={block.href.startsWith('http') ? '_blank' : undefined}
          rel={
            block.href.startsWith('http') ? 'noreferrer noopener' : undefined
          }
          className="text-primary hover:decoration-primary focus-visible:ring-ring inline-flex w-fit items-center gap-1.5 rounded text-[13px] underline decoration-transparent underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {block.label}
          <ArrowUpRight className="size-3.5" />
        </a>
      )

    case 'divider':
      return <hr className="border-border/70 my-0.5" />

    case 'spinner':
      return (
        <p className="text-muted-foreground animate-pulse font-mono text-xs">
          {block.text}
        </p>
      )

    case 'github':
      return <GithubPanel />

    default: {
      // Exhaustiveness guard: adding a Block kind without a renderer becomes
      // a type error here rather than a blank line at runtime.
      const never: never = block
      return never
    }
  }
}
