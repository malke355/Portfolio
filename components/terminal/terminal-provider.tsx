'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Terminal } from '@/components/terminal/terminal'

type TerminalApi = {
  open: boolean
  openTerminal: () => void
  closeTerminal: () => void
}

const TerminalContext = createContext<TerminalApi | null>(null)

export function useTerminal() {
  const context = useContext(TerminalContext)
  if (!context) {
    throw new Error('useTerminal must be used inside <TerminalProvider>.')
  }
  return context
}

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  const openTerminal = useCallback(() => setOpen(true), [])
  const closeTerminal = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const modifier = event.metaKey || event.ctrlKey

      if (modifier && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((current) => !current)
        return
      }

      // Slash opens the prompt the way it does on GitHub, but not while the
      // visitor is already typing somewhere.
      if (event.key === '/' && !modifier) {
        const target = event.target as HTMLElement | null
        const tag = target?.tagName
        if (
          tag === 'INPUT' ||
          tag === 'TEXTAREA' ||
          target?.isContentEditable === true
        ) {
          return
        }
        event.preventDefault()
        setOpen(true)
        return
      }

      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const value = useMemo(
    () => ({ open, openTerminal, closeTerminal }),
    [open, openTerminal, closeTerminal],
  )

  return (
    <TerminalContext.Provider value={value}>
      {children}
      <Terminal open={open} onClose={closeTerminal} />
    </TerminalContext.Provider>
  )
}
