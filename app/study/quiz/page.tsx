import tarotCards from '@/lib/tarot-data'
import StudyClient from './StudyClient'


export default function QuizPage() {
  return <StudyClient cards={tarotCards} />
}
