"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { MeshTransmissionMaterial } from "@react-three/drei"
import type * as THREE from "three"

export default function RoboticHand() {
  const handRef = useRef<THREE.Group>(null)

  // Animate the hand
  useFrame((state) => {
    if (!handRef.current) return

    const t = state.clock.getElapsedTime()
    handRef.current.rotation.y = Math.sin(t / 2) * 0.5
    handRef.current.rotation.z = Math.cos(t / 4) * 0.2
    handRef.current.position.y = Math.sin(t / 2) * 0.2
  })

  return (
    <group ref={handRef} position={[0, 0, 0]} scale={1.5}>
      {/* Palm base */}
      <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[1, 0.2, 1.2]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Wrist joint */}
      <mesh castShadow position={[0, -0.1, 0.7]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.3, 16]} />
        <meshStandardMaterial
          color="#00FFFF"
          emissive="#00FFFF"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Finger bases - mechanical joints */}
      {[-0.4, -0.2, 0, 0.2, 0.4].map((x, i) => (
        <mesh key={`joint-${i}`} castShadow position={[x, 0.1, -0.4]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
          <meshStandardMaterial
            color="#9B5DE5"
            emissive="#9B5DE5"
            emissiveIntensity={0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Robotic fingers */}
      {[
        { x: -0.4, color: "#9B5DE5", delay: 0 }, // Purple
        { x: -0.2, color: "#9B5DE5", delay: 0.1 }, // Purple
        { x: 0, color: "#00FFFF", delay: 0.2 }, // Cyan
        { x: 0.2, color: "#9B5DE5", delay: 0.3 }, // Purple
        { x: 0.4, color: "#9B5DE5", delay: 0.4 }, // Purple
      ].map((finger, i) => (
        <RoboticFinger
          key={i}
          position={[finger.x, 0.1, -0.4]}
          color={finger.color}
          delay={finger.delay}
          isMiddle={i === 2}
        />
      ))}

      {/* Palm circuitry details */}
      <mesh position={[0, 0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial
          color="#333"
          metalness={0.7}
          roughness={0.3}
          emissive="#00FFFF"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Glowing core */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          thickness={0.2}
          chromaticAberration={0.05}
          anisotropy={0.1}
          distortion={0.5}
          distortionScale={0.3}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          color="#00FFFF"
          emissive="#00FFFF"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  )
}

interface RoboticFingerProps {
  position: [number, number, number]
  color: string
  delay: number
  isMiddle?: boolean
}

function RoboticFinger({ position, color, delay, isMiddle = false }: RoboticFingerProps) {
  const fingerRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!fingerRef.current) return

    const t = state.clock.getElapsedTime() + delay * 10
    // Different animation for each finger
    const flexAmount = Math.sin(t) * 0.2

    // Animate finger segments
    if (fingerRef.current.children.length >= 3) {
      const segment1 = fingerRef.current.children[0] as THREE.Mesh
      const segment2 = fingerRef.current.children[1] as THREE.Mesh
      const segment3 = fingerRef.current.children[2] as THREE.Mesh

      segment1.rotation.x = flexAmount
      segment2.rotation.x = flexAmount * 0.7
      segment3.rotation.x = flexAmount * 0.5
    }
  })

  return (
    <group ref={fingerRef} position={position}>
      {/* Finger segments */}
      {[0, 1, 2].map((segment) => (
        <group key={segment} position={[0, 0, -0.15 - segment * 0.3]}>
          {/* Segment cylinder */}
          <mesh castShadow position={[0, 0, -0.15]}>
            <cylinderGeometry args={[0.06, 0.05, 0.3, 8]} />
            <meshStandardMaterial
              color={isMiddle ? "#00FFFF" : color}
              emissive={isMiddle ? "#00FFFF" : color}
              emissiveIntensity={isMiddle ? 0.5 : 0.2}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Joint sphere */}
          <mesh castShadow position={[0, 0, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Glowing ring */}
          <mesh position={[0, 0, -0.25]}>
            <torusGeometry args={[0.07, 0.01, 8, 16]} />
            <meshStandardMaterial
              color={isMiddle ? "#00FFFF" : color}
              emissive={isMiddle ? "#00FFFF" : color}
              emissiveIntensity={0.8}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        </group>
      ))}

      {/* Fingertip */}
      <mesh position={[0, 0, -1.05]} castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial
          color={isMiddle ? "#00FFFF" : color}
          emissive={isMiddle ? "#00FFFF" : color}
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  )
}
