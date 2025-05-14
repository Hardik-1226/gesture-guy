"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Text } from "@react-three/drei"
import type * as THREE from "three"
import RoboticHand from "./robotic-hand"

// Main Three.js scene component
export default function ThreeScene() {
  const [isLoaded, setIsLoaded] = useState(false)

  // Set loaded state after a short delay to ensure smooth transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full h-full">
      {!isLoaded && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-primary">Loading visualization...</p>
          </div>
        </div>
      )}
      <div className={`w-full h-full ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Environment preset="city" />

          <RoboticHand autoAnimate={true} />
          <GestureParticles />
          <FloatingText />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>
    </div>
  )
}

// Floating text component
function FloatingText() {
  const { viewport } = useThree()
  const textRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!textRef.current) return

    const t = state.clock.getElapsedTime()
    textRef.current.position.y = Math.sin(t / 2) * 0.3 + 1.5
    textRef.current.rotation.z = Math.sin(t / 4) * 0.1
  })

  return (
    <group ref={textRef} position={[0, 1.5, 0]}>
      <Text color="#00FFFF" fontSize={0.3} maxWidth={200} lineHeight={1} letterSpacing={0.02} textAlign="center">
        GestureGuy
      </Text>
    </group>
  )
}

// Optimized gesture particles component
function GestureParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const [particles, setParticles] = useState<Float32Array | null>(null)

  useEffect(() => {
    // Reduced particle count for better performance
    const count = 100
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 5
      positions[i3 + 1] = (Math.random() - 0.5) * 5
      positions[i3 + 2] = (Math.random() - 0.5) * 5
    }

    setParticles(positions)
  }, [])

  useFrame((state) => {
    if (!particlesRef.current) return

    const t = state.clock.getElapsedTime()
    particlesRef.current.rotation.y = t * 0.05
    particlesRef.current.rotation.x = t * 0.025
  })

  if (!particles) return null

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#00FFFF" sizeAttenuation transparent opacity={0.8} depthWrite={false} />
    </points>
  )
}
