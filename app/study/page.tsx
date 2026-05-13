import tarotCards from '@/lib/tarot-data'
import StudyClient from './StudyClient'

export default function StudyPage() {
  return <StudyClient cards={tarotCards} />
}
