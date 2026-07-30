'use client'

import { Printer } from 'lucide-react'

export function PrintButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      <Printer className="size-4" />
      Save as PDF
    </button>
  )
}
