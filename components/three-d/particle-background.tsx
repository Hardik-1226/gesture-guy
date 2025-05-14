"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface ParticleBackgroundProps {
  count?: number
}

export default function ParticleBackground({ count = 500 }: ParticleBackgroundProps) {
  const mesh = useRef<THREE.Points>(null)

  // Create particles only once using useMemo
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 10
      positions[i3 + 1] = (Math.random() - 0.5) * 10
      positions[i3 + 2] = (Math.random() - 0.5) * 10
    }

    return positions
  }, [count])

  // Create a buffer attribute for positions
  const positionAttribute = useMemo(() => {
    return new THREE.BufferAttribute(particlesPosition, 3)
  }, [particlesPosition])

  // Optimize animation by limiting updates
  useFrame((state) => {
    if (!mesh.current) return

    const time = state.clock.getElapsedTime()

    // Rotate the entire particle system instead of updating individual particles
    mesh.current.rotation.y = time * 0.05
    mesh.current.rotation.x = time * 0.025
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" {...positionAttribute} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#00FFFF" sizeAttenuation transparent opacity={0.8} depthWrite={false} />
    </points>
  )
}
