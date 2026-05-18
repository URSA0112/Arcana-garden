'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TIMELINE } from '../data/timeline'

export interface HistoryAnimationRefs {
  sectionRef: React.RefObject<HTMLElement | null>
  headRef:    React.RefObject<HTMLDivElement | null>
  setImgRef:  (index: number) => (el: HTMLDivElement | null) => void
  setTxtRef:  (index: number) => (el: HTMLDivElement | null) => void
}

export function useHistoryAnimations(): HistoryAnimationRefs {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef    = useRef<HTMLDivElement>(null)
  const imgRefs    = useRef<(HTMLDivElement | null)[]>([])
  const txtRefs    = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (headRef.current) {
        gsap.from(Array.from(headRef.current.children), {
          y: 28, opacity: 0, duration: 0.82, stagger: 0.14, ease: 'power3.out',
          scrollTrigger: { trigger: headRef.current, start: 'top 82%' },
        })
      }

      TIMELINE.forEach((_, i) => {
        const imgEl    = imgRefs.current[i]
        const txtEl    = txtRefs.current[i]
        const imgOnLeft = i % 2 === 0

        if (imgEl) {
          gsap.from(imgEl, {
            x: imgOnLeft ? -60 : 60, opacity: 0, duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: imgEl, start: 'top 85%' },
          })
        }
        if (txtEl) {
          gsap.from(txtEl, {
            x: imgOnLeft ? 42 : -42, opacity: 0, duration: 0.95, ease: 'power3.out', delay: 0.13,
            scrollTrigger: { trigger: txtEl, start: 'top 85%' },
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const setImgRef = (index: number) => (el: HTMLDivElement | null) => {
    imgRefs.current[index] = el
  }

  const setTxtRef = (index: number) => (el: HTMLDivElement | null) => {
    txtRefs.current[index] = el
  }

  return { sectionRef, headRef, setImgRef, setTxtRef }
}
