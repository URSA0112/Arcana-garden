import { notFound } from 'next/navigation'
import { getCardBySlug } from '@/lib/tarot-data'
import CardDetailClient from './CardDetailClient'

export default async function CardDetailPage(props: PageProps<'/library/[slug]'>) {
  const { slug } = await props.params
  const card = getCardBySlug(slug)
  if (!card) notFound()
  return <CardDetailClient card={card} />
}
