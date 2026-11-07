export type Achievement = {
  id: string
  place: string
  title: string
  event: string
  dates: string
  venue: string
  city: string
  summary: string
  partners: readonly string[]
  signedBy: {
    name: string
    title: string
  }
  image: string
  alt: string
}

/**
 * Published achievements only. Every field is taken from Melkamu's certificate
 * (or other verified materials) — nothing here is invented.
 */
export const achievements: readonly Achievement[] = [
  {
    id: 'cursor-ai-hackathon-ethiopia',
    place: '1st Place',
    title: '1st Place Certificate',
    event: 'Cursor AI Hackathon Ethiopia',
    dates: 'July 25–26',
    venue: 'Adwa Museum',
    city: 'Addis Ababa',
    summary:
      'For taking part in a day-and-a-half Cursor AI Hackathon at Adwa Museum, in partnership with the Ministry of Innovation and Technology (MinT) and Ethio telecom.',
    partners: [
      'Ministry of Innovation and Technology (MinT)',
      'Ethio telecom',
    ],
    signedBy: {
      name: 'Alpha Lencho',
      title: 'Cursor Ambassador',
    },
    image: '/images/certificate-cursor-hackathon.png',
    alt: '1st Place certificate for Melkamu at Cursor AI Hackathon Ethiopia, Adwa Museum, Addis Ababa, July 25–26',
  },
] as const
