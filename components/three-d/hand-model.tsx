"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

export default function HandModel() {
  const handRef = useRef<THREE.Group>(null)
  const [gestureState, setGestureState] = useState("idle")

  // Cycle through different gestures to showcase functionality
  useFrame((state) => {
    if (!handRef.current) return

    const time = state.clock.getElapsedTime()
    const cycleTime = 3 // Change gesture every 3 seconds
    const gestureIndex = Math.floor((time % (cycleTime * 5)) / cycleTime)

    // Base hand position
    handRef.current.rotation.x = Math.sin(time * 0.2) * 0.1
    handRef.current.rotation.y = Math.sin(time * 0.1) * 0.1

    // Get references to finger meshes
    const thumb = handRef.current.children[1] as THREE.Mesh
    const indexFinger = handRef.current.children[2] as THREE.Mesh
    const middleFinger = handRef.current.children[3] as THREE.Mesh
    const ringFinger = handRef.current.children[4] as THREE.Mesh
    const pinkyFinger = handRef.current.children[5] as THREE.Mesh

    // Reset all finger positions
    indexFinger.rotation.set(0.2, 0, 0)
    middleFinger.rotation.set(0.2, 0, 0)
    ringFinger.rotation.set(0.2, 0, 0)
    pinkyFinger.rotation.set(0.2, 0, 0)
    thumb.rotation.set(0, 0, -0.5)

    // Apply different gestures based on time
    switch (gestureIndex) {
      case 0: // Cursor movement - default position
        setGestureState("cursor")
        break

      case 1: // Click gesture - index finger and thumb close together
        setGestureState("click")
        indexFinger.rotation.set(-0.8, 0, 0)
        thumb.rotation.set(0.5, 0.3, 0)
        break

      case 2: // Scroll gesture - thumb up
        setGestureState("scroll")
        thumb.rotation.set(-1.2, 0, -0.5)
        break

      case 3: // Volume gesture - V shape with index and middle
        setGestureState("volume")
        indexFinger.rotation.set(-0.5, -0.3, 0)
        middleFinger.rotation.set(-0.5, 0.3, 0)
        ringFinger.rotation.set(0.8, 0, 0)
        pinkyFinger.rotation.set(0.8, 0, 0)
        break

      case 4: // Zoom gesture - thumb and pinky close
        setGestureState("zoom")
        thumb.rotation.set(0.5, 0.8, 0)
        pinkyFinger.rotation.set(0.8, -0.5, 0)
        break
    }
  })

  return (
    <group ref={handRef}>
      {/* Palm */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.8, 0.2]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00FFFF"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Thumb */}
      <mesh position={[-0.3, 0.1, 0]} rotation={[0, 0, -0.5]} castShadow>
        <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00FFFF"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Index Finger */}
      <mesh position={[-0.15, 0.5, 0]} rotation={[0.2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.05, 0.4, 4, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00FFFF"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Middle Finger */}
      <mesh position={[0.05, 0.5, 0]} rotation={[0.2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.05, 0.45, 4, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={gestureState === "cursor" ? "#FF4D9D" : "#00FFFF"} // Highlight middle finger for cursor control
          emissiveIntensity={gestureState === "cursor" ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Ring Finger */}
      <mesh position={[0.25, 0.5, 0]} rotation={[0.2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.05, 0.4, 4, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00FFFF"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Pinky Finger */}
      <mesh position={[0.45, 0.5, 0]} rotation={[0.2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.04, 0.35, 4, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00FFFF"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Gesture label */}
      <group position={[0, -1, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1.5, 0.4]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.7} />
        </mesh>
      </group>
    </group>
  )
}
