import { getDailyCard } from '@/lib/tarot-data'
import HeroSection from './components/HeroSection'
import HistorySection from './components/HistorySection'

export default function HomePage() {
  const dailyCard = getDailyCard()

  return (
    <div style={{ backgroundColor: '#0A0A0A' }}>
      <HeroSection card={dailyCard} />
      <HistorySection />
    </div>
  )
}
