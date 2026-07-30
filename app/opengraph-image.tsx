import { ImageResponse } from 'next/og'
import { site } from '@/lib/site'

export const alt = site.title
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const stack = ['React', 'Next.js', 'TypeScript', 'Node.js', 'React Native']

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px',
        backgroundColor: '#0b120e',
        backgroundImage:
          'radial-gradient(circle at 12% 8%, rgba(52,211,153,0.28) 0%, transparent 48%), radial-gradient(circle at 88% 92%, rgba(52,211,153,0.16) 0%, transparent 46%)',
        color: '#f2f7f4',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 60,
            height: 60,
            borderRadius: 18,
            backgroundColor: 'rgba(52,211,153,0.16)',
            border: '1px solid rgba(52,211,153,0.4)',
            color: '#34d399',
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          {site.initials}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 24, fontWeight: 600 }}>melkamu.dev</span>
          <span style={{ fontSize: 18, color: 'rgba(242,247,244,0.6)' }}>
            {site.location}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <span
          style={{
            fontSize: 22,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#34d399',
          }}
        >
          {site.role}
        </span>
        <span
          style={{
            fontSize: 74,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          {site.name}
        </span>
        <span
          style={{
            fontSize: 28,
            lineHeight: 1.4,
            color: 'rgba(242,247,244,0.72)',
            maxWidth: 880,
          }}
        >
          Building modern web and mobile products — pixel-precise interfaces on
          reliable, well-architected APIs.
        </span>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        {stack.map((item) => (
          <span
            key={item}
            style={{
              display: 'flex',
              padding: '10px 20px',
              borderRadius: 999,
              border: '1px solid rgba(242,247,244,0.16)',
              backgroundColor: 'rgba(242,247,244,0.05)',
              fontSize: 22,
              color: 'rgba(242,247,244,0.85)',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>,
    size,
  )
}
