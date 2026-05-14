'use client'

// Suppress THREE.Clock deprecation (R3F 9.x internal, not our code)
if (typeof window !== 'undefined') {
  const _warn = console.warn.bind(console)
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].startsWith('THREE.Clock')) return
    _warn(...args)
  }
}

import { Component, ErrorInfo, ReactNode, Suspense, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────
// CARD FACES — replace with your own Cloudinary URLs when ready.
// Three.js TextureLoader fetches these directly (full https:// URL).
// front = card illustration  |  back = card back design
// ─────────────────────────────────────────────────────────────────
const CL = 'https://res.cloudinary.com/dt43fy6cr/image/upload'

const CARD_FACES = [
  {
    front: `https://res.cloudinary.com/dt43fy6cr/image/upload/v1778754003/sun_1_hkprtt.jpg`,
    back:  `https://res.cloudinary.com/dt43fy6cr/image/upload/v1778754004/moon_kdkgec.webp`,
  },
  {
    front: `https://res.cloudinary.com/dt43fy6cr/image/upload/v1778754004/lovers_uc8pwi.jpg`,
    back:  `https://res.cloudinary.com/dt43fy6cr/image/upload/v1778754003/devil_ukzuzo.jpg`,
  },
  {
    front: `https://res.cloudinary.com/dt43fy6cr/image/upload/v1778754003/magician_bp5rta.jpg`,
    back:  `https://res.cloudinary.com/dt43fy6cr/image/upload/v1778754002/judgement_btrtg9.jpg`,
  },
  {
    front: `https://res.cloudinary.com/dt43fy6cr/image/upload/v1778754003/tower_fnhb9p.jpg`,
    back:  `https://res.cloudinary.com/dt43fy6cr/image/upload/v1778754003/hierophant_bpiv8s.jpg`,
  },
]

// ─────────────────────────────────────────────────────────────────
// CARD POSITIONS — pos [x,y,z]  rot [x,y,z] rad  spinY rad/s
// ─────────────────────────────────────────────────────────────────
const CARDS = [
  // LEFT (main visual anchor)
  {
    pos: [-1.45,  0.25,  1.45] as [number, number, number],
    rot: [ 0.08, -0.35,  0.05] as [number, number, number],
    spinY:  0.22,
    fs: 1.25,
    fi: 0.7,
  },

  // RIGHT (balanced with left)
  {
    pos: [ 1.45,  0.25,  1.45] as [number, number, number],
    rot: [ 0.08,  0.35, -0.05] as [number, number, number],
    spinY: -0.22,
    fs: 1.25,
    fi: 0.7,
  },

  // TOP (subtle, background feel)
  {
    pos: [ 0.25,  1.15,  1.55] as [number, number, number],
    rot: [-0.12,  0.10, -0.08] as [number, number, number],
    spinY: -0.18,
    fs: 0.95,
    fi: 0.5,
  },

  // BOTTOM (angled toward center card)
  {
    pos: [-0.25, -1.05,  1.35] as [number, number, number],
    rot: [ 0.18, -0.12,  0.22] as [number, number, number],
    spinY:  0.30,
    fs: 1.05,
    fi: 0.6,
  },
]

const W = 0.8   // tarot proportions ~1 : 1.73
const H = 1.4
const D = 0.01

type CardCfg    = typeof CARDS[number]
type CardFaces  = typeof CARD_FACES[number]

const EDGE_MAT = new THREE.MeshStandardMaterial({ color: '#080808', roughness: 0.9 })

// ── ErrorBoundary ──────────────────────────────────────────────────
// Suspense handles loading (Promise throw).
// ErrorBoundary handles failure (Error throw — e.g. 404 / CORS).
// Without this, a failed useTexture would crash the whole canvas.
class CardErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { crashed: boolean }
> {
  state = { crashed: false }
  static getDerivedStateFromError() { return { crashed: true } }
  componentDidCatch(_e: Error, _i: ErrorInfo) { /* silently fall back */ }
  render() {
    return this.state.crashed ? this.props.fallback : this.props.children
  }
}

// ── FallbackCard ───────────────────────────────────────────────────
// Color-only card — always visible, no network dependency.
function FallbackCard({ c }: { c: CardCfg }) {
  const ref = useRef<THREE.Mesh>(null)

  const mats = useMemo(() => [
    EDGE_MAT, EDGE_MAT, EDGE_MAT, EDGE_MAT,
    new THREE.MeshStandardMaterial({ color: '#C6A85B', emissive: '#1a1200', emissiveIntensity: 0.2,  roughness: 0.35, metalness: 0.18 }),
    new THREE.MeshStandardMaterial({ color: '#141414', emissive: '#0a0a0a', emissiveIntensity: 0.2,  roughness: 0.25, metalness: 0.65 }),
  ], [])

  useEffect(() => () => { mats.slice(4).forEach(m => m.dispose()) }, [mats])
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * c.spinY })

  return (
    <Float speed={c.fs} rotationIntensity={0.1} floatIntensity={c.fi}>
      <mesh ref={ref} material={mats} position={c.pos} rotation={c.rot}>
        <boxGeometry args={[W, H, D]} />
      </mesh>
    </Float>
  )
}

// ── TexturedCard ───────────────────────────────────────────────────
// useTexture suspends while loading → Suspense shows FallbackCard.
// If the URL is unreachable → ErrorBoundary shows FallbackCard.
function TexturedCard({ c, faces }: { c: CardCfg; faces: CardFaces }) {
  const ref = useRef<THREE.Mesh>(null)
  const [ft, bt] = useTexture([faces.front, faces.back])

  const mats = useMemo(() => [
    EDGE_MAT, EDGE_MAT, EDGE_MAT, EDGE_MAT,
    new THREE.MeshStandardMaterial({ map: ft, roughness: 0.18, metalness: 0.05 }),
    new THREE.MeshStandardMaterial({ map: bt, roughness: 0.18, metalness: 0.05 }),
  ], [ft, bt])

  useEffect(() => () => { mats.slice(4).forEach(m => m.dispose()) }, [mats])
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * c.spinY })

  return (
    <Float speed={c.fs} rotationIntensity={0.1} floatIntensity={c.fi}>
      <mesh ref={ref} material={mats} position={c.pos} rotation={c.rot}>
        <boxGeometry args={[W, H, D]} />
      </mesh>
    </Float>
  )
}

// ── FloatingCard ───────────────────────────────────────────────────
// Three layers of safety:
//   CardErrorBoundary → catches load errors  (Error throw)
//   Suspense          → catches loading state (Promise throw)
//   FallbackCard      → color card, always works
function FloatingCard({ c, faces }: { c: CardCfg; faces: CardFaces }) {
  const fallback = <FallbackCard c={c} />
  return (
    <CardErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <TexturedCard c={c} faces={faces} />
      </Suspense>
    </CardErrorBoundary>
  )
}

// ── Scene ──────────────────────────────────────────────────────────
export default function FloatingCards3D() {
  return (
  
    <Canvas
      camera={{ position: [0, 0, 5], fov: 56 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.38} />
      <directionalLight position={[3, 5, 5]} intensity={2.2} color="#f0e0b0" />
      <pointLight position={[-5, 2, -2]} intensity={1.4} color="#d4a855" />
      <pointLight position={[0, -4, 2]}  intensity={0.6} color="#b8922a" />

      <Stars radius={80} depth={38} count={1800} factor={2.4} fade speed={0.25} />

      {CARDS.map((c, i) => (
        <FloatingCard key={i} c={c} faces={CARD_FACES[i]} />
      ))}
    </Canvas>
  )
}
