import tarotCards from '@/lib/tarot-data'
import LibraryClient from './LibraryClient'

export default function LibraryPage() {
  return <LibraryClient cards={tarotCards} />
}
