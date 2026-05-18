'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { TRACKS, type TrackId } from '@/app/constants/music'

export type { TrackId }

export function useAudio() {
  const audioRef              = useRef<HTMLAudioElement | null>(null)
  const [playing,  setPlaying]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [activeId, setActiveId] = useState<TrackId>('drone')

  const getAudio = useCallback(() => {
    if (!audioRef.current) audioRef.current = new Audio()
    return audioRef.current
  }, [])

  const startTrack = useCallback((url: string) => {
    const audio = getAudio()
    if (audio.src !== url) { audio.pause(); audio.src = url }
    setLoading(true)
    audio.play()
      .then(() => { setPlaying(true); setLoading(false) })
      .catch(() => { setPlaying(false); setLoading(false) })
  }, [getAudio])

  const toggle = useCallback(() => {
    const audio = getAudio()
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      startTrack(TRACKS.find((t) => t.id === activeId)!.url)
    }
  }, [playing, activeId, getAudio, startTrack])

  const selectTrack = useCallback((id: TrackId) => {
    setActiveId(id)
    if (playing) startTrack(TRACKS.find((t) => t.id === id)!.url)
  }, [playing, startTrack])

  useEffect(() => {
    const audio = getAudio()
    const onWaiting = () => setLoading(true)
    const onPlaying = () => setLoading(false)
    const onError   = () => { setPlaying(false); setLoading(false) }
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('error',   onError)
    return () => {
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('error',   onError)
    }
  }, [getAudio])

  useEffect(() => () => { audioRef.current?.pause() }, [])

  return { playing, loading, activeId, toggle, selectTrack }
}
