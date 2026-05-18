'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export interface HeroAnimationRefs {
  labelRef:   React.RefObject<HTMLParagraphElement | null>
  titleRef:   React.RefObject<HTMLHeadingElement | null>
  subRef:     React.RefObject<HTMLParagraphElement | null>
  dividerRef: React.RefObject<HTMLDivElement | null>
  cardRef:    React.RefObject<HTMLDivElement | null>
}

export function useHeroAnimation(): HeroAnimationRefs {
  const labelRef   = useRef<HTMLParagraphElement>(null)
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const subRef     = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const cardRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(labelRef.current,   { y: 0, opacity: 1, duration: 0.6 })
        .to(titleRef.current,   { y: 0, opacity: 1, duration: 1.0 }, '-=0.35')
        .to(subRef.current,     { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
        .to(dividerRef.current, { opacity: 1,        duration: 0.5 }, '-=0.3')
        .to(cardRef.current,    { y: 0, opacity: 1, duration: 0.9 }, '-=0.25')
    })
    return () => ctx.revert()
  }, [])

  return { labelRef, titleRef, subRef, dividerRef, cardRef }
}
