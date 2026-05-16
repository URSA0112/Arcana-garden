import { SelectedCard, ParsedReading } from './reading-types'

export function strongShuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  const randoms = new Uint32Array(a.length * 3)
  crypto.getRandomValues(randoms)
  for (let pass = 0; pass < 3; pass++) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = randoms[pass * a.length + i] % (i + 1)
      ;[a[i], a[j]] = [a[j], a[i]]
    }
  }
  return a
}

export function parseReading(raw: string): ParsedReading {
  const result: ParsedReading = { cards: {}, advice: '', synthesis: '' }
  const parts = raw.split(/\[([A-Z][A-Z:a-zA-Z ]*)\]/)
  for (let i = 1; i < parts.length; i += 2) {
    const key  = parts[i]?.trim()
    const text = (parts[i + 1] ?? '').trim()
    if (!key) continue
    if (key.startsWith('CARD:')) result.cards[key.slice(5).trim()] = text
    else if (key === 'ADVICE')    result.advice    = text
    else if (key === 'SYNTHESIS') result.synthesis = text
  }
  return result
}

export function buildFallbackReading(selectedCards: SelectedCard[], question: string): string {
  const lines: string[] = []

  for (const sc of selectedCards) {
    lines.push(`[CARD:${sc.label}]`)
    const meaning = sc.reversed ? sc.card.reversed : sc.card.upright
    const kw = sc.card.keywords

    const opener: Record<string, string> = {
      Past: "Looking back, there's the energy of",
      Present: "Right now, what's present is",
      Future: "What's ahead carries",
      'Your Message': "What comes through clearly is",
    }

    lines.push(
      `${opener[sc.label] ?? "Here, there's"} ${kw.slice(0, 3).join(', ')}. ${meaning} ` +
      `You might recognize this in the texture of recent days${question ? ` — particularly around what you've been navigating` : ''}.`
    )
    lines.push('')
    if (sc.reversed) {
      lines.push(
        `${sc.card.name} reversed often points to something that's internalized or stalled — a quality you're aware of but haven't fully moved with yet. ` +
        `That gap between knowing and acting is rarely failure; it's usually just timing finding its shape.`
      )
    } else {
      lines.push(
        `${sc.card.name} here brings ${kw[0] ?? 'a clear energy'} into focus. ` +
        `Where in your daily life — in work, in how you show up with people, in the quiet moments — does this feel most alive or most needed right now?`
      )
    }
    lines.push('')
  }

  const futureCard = selectedCards.find(c => c.label === 'Future')
  if (futureCard) {
    const fkw = futureCard.card.keywords
    lines.push('[ADVICE]')
    lines.push(
      `With ${futureCard.card.name} ahead, it's worth paying attention to ${fkw[0] ?? 'how you respond'} ` +
      `and where ${fkw[1] ?? 'this energy'} shows up in small moments. ` +
      `The choices that shape things most often don't look significant when you're making them — ` +
      `that's what makes this card worth staying awake to.`
    )
    lines.push('')
  }

  lines.push('[SYNTHESIS]')
  if (selectedCards.length === 3) {
    const [p, pr, f] = selectedCards
    lines.push(
      `${p?.card.name}${p?.reversed ? ' reversed' : ''} in the past, ` +
      `${pr?.card.name}${pr?.reversed ? ' reversed' : ''} present, ` +
      `${f?.card.name}${f?.reversed ? ' reversed' : ''} ahead — ` +
      `these aren't separate chapters but parts of the same thread. ` +
      `What you've carried shaped where you're standing, and what you're learning now is already shaping what comes next.`
    )
    lines.push('')
    lines.push(
      "For this week: notice one place where the energy of the middle card — the present — is asking something of you. " +
      "That's usually where the work actually is."
    )
  } else {
    const card = selectedCards[0]
    if (card) {
      lines.push(
        `${card.card.name}${card.reversed ? ' reversed' : ''} as your message today brings ${card.card.keywords[0] ?? 'something worth sitting with'} into focus. ` +
        `Whatever brought you to draw this card — the question beneath the question — is worth staying with. ` +
        `What would it look like to take this message seriously in one small, concrete way this week?`
      )
    }
  }

  return lines.join('\n')
}

export function playSound(type: 'pick' | 'unpick' | 'done') {
  try {
    const ctx = new AudioContext()
    const t   = ctx.currentTime
    const tone = (freq: number, vol: number, start: number, dur: number, freqEnd?: number) => {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t + start)
      if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t + start + dur * 0.45)
      gain.gain.setValueAtTime(0, t + start)
      gain.gain.linearRampToValueAtTime(vol, t + start + 0.014)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + start + dur)
      osc.start(t + start); osc.stop(t + start + dur + 0.05)
    }
    if (type === 'pick')        { tone(523.25, 0.09, 0, 0.4, 659.25); tone(1046.5, 0.035, 0.01, 0.22) }
    else if (type === 'unpick') { tone(440, 0.065, 0, 0.22, 349.23) }
    else { tone(261.63, 0.07, 0, 0.65); tone(329.63, 0.055, 0.055, 0.58); tone(392, 0.045, 0.11, 0.52); tone(523.25, 0.035, 0.17, 0.45) }
    setTimeout(() => ctx.close(), 1200)
  } catch { /* AudioContext unavailable */ }
}
