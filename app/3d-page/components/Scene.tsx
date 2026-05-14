// ─────────────────────────────────────────────
// Scene.tsx — React Three Fiber canvas
//
// What lives here:
//   • Canvas (the WebGL surface)
//   • Lights
//   • Stars background (drei helper)
//   • CardFallback — color-only card shown while
//     textures are loading or missing
//   • TarotCard — same card but with textures
//     loaded via useTexture once files exist
//
// Suspense pattern (R3F supports it natively):
//   <Suspense fallback={<CardFallback />}>
//     <TarotCard />        ← suspends while loading
//   </Suspense>
//   → fallback shows until textures resolve.
//   → if files are missing, fallback stays visible
//     (no crash, no disappearing card).
//
// To activate textures: drop card-face.jpg and
// card-back.jpg into /public — they load automatically.
// ─────────────────────────────────────────────
'use client'

// THREE.Clock was deprecated in Three.js r170. R3F 9.x and stats-gl still use
// it internally; neither has migrated to THREE.Timer yet. Suppress just that
// one warning so the console stays clean until the libraries catch up.
if (typeof window !== 'undefined') {
  const _warn = console.warn.bind(console)
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].startsWith('THREE.Clock')) return
    _warn(...args)
  }
}

import { Suspense, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// ── Shared card geometry ─────────────────────
// Tarot cards are ~2.75" × 4.75" → ratio 1 : 1.73
const CARD_W = 2
const CARD_H = 3
const CARD_D = 0.04

// ── Shared rotation hook ─────────────────────
function useCardSpin(meshRef: React.RefObject<THREE.Mesh | null>) {
  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += delta * 0.55
  })
}

// ── CardFallback ─────────────────────────────
// Shown by Suspense while textures are loading
// or when /public images don't exist yet.
// Uses plain colors — always visible, never crashes.
function CardFallback() {
  const meshRef = useRef<THREE.Mesh>(null)
  useCardSpin(meshRef)

  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: '#0e1a0a', roughness: 0.9 }), // right
    new THREE.MeshStandardMaterial({ color: '#0e1a0a', roughness: 0.9 }), // left
    new THREE.MeshStandardMaterial({ color: '#0e1a0a', roughness: 0.9 }), // top
    new THREE.MeshStandardMaterial({ color: '#0e1a0a', roughness: 0.9 }), // bottom
    new THREE.MeshStandardMaterial({                                       // front
      color: '#EBD5AB',
      emissive: '#3d2005',
      emissiveIntensity: 0.18,
      roughness: 0.35,
      metalness: 0.12,
    }),
    new THREE.MeshStandardMaterial({                                       // back
      color: '#2d4a1f',
      emissive: '#0d1a08',
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.65,
    }),
  ], [])

  useEffect(() => () => { materials.forEach((m) => m.dispose()) }, [materials])

  return (
    <Float speed={1.4} rotationIntensity={0.18} floatIntensity={1.1}>
      <mesh ref={meshRef} material={materials}>
        <boxGeometry args={[CARD_W, CARD_H, CARD_D]} />
      </mesh>
    </Float>
  )
}

// ── TarotCard ────────────────────────────────
// useTexture suspends this component while the
// images are fetching. Suspense catches that and
// renders CardFallback in the meantime.
// Drop card-face.jpg + card-back.jpg in /public
// and this component will take over automatically.
function TarotCard() {
  const meshRef = useRef<THREE.Mesh>(null)
  useCardSpin(meshRef)

  const [frontTex, backTex] = useTexture(['/card-face.webp', '/card-back.webp'])

  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: '#0e1a0a', roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ color: '#0e1a0a', roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ color: '#0e1a0a', roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ color: '#0e1a0a', roughness: 0.9 }),
    new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.35, metalness: 0.12 }),
    new THREE.MeshStandardMaterial({ map: backTex,  roughness: 0.3,  metalness: 0.65 }),
  ], [frontTex, backTex])

  useEffect(() => () => { materials.forEach((m) => m.dispose()) }, [materials])

  return (
    <Float speed={1.4} rotationIntensity={0.18} floatIntensity={1.1}>
      <mesh ref={meshRef} material={materials}>
        <boxGeometry args={[CARD_W, CARD_H, CARD_D]} />
      </mesh>
    </Float>
  )
}

// ── Scene ────────────────────────────────────
export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#f5dfa0" />
      <pointLight position={[-5, 2, -3]} intensity={2} color="#4ade80" />
      <pointLight position={[0, -4, 2]} intensity={0.8} color="#a3e635" />

      <Stars radius={90} depth={50} count={2800} factor={3} fade speed={0.4} />

      {/*
        Suspense inside Canvas — fully supported by R3F.
        fallback renders CardFallback (color card) while
        TarotCard's useTexture is loading or if files are absent.
      */}
      <Suspense fallback={<CardFallback />}>
        <TarotCard />
      </Suspense>
    </Canvas>
  )
}
