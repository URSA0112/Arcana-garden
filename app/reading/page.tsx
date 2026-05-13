import tarotCards from '@/lib/tarot-data'
import ReadingClient from './ReadingClient'

export default function ReadingPage() {
  return <ReadingClient cards={tarotCards} />
}
