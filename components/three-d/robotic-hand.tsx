"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { MeshTransmissionMaterial, Text } from "@react-three/drei"
import type * as THREE from "three"

// Define gesture types
export type GestureType = "idle" | "point" | "grab" | "pinch" | "swipe" | "wave" | "thumbsUp" | "peace" | "fist"

interface RoboticHandProps {
  gestureType?: GestureType
  autoAnimate?: boolean
  showLabels?: boolean
}

export default function RoboticHand({
  gestureType = "idle",
  autoAnimate = false,
  showLabels = false,
}: RoboticHandProps) {
  const handRef = useRef<THREE.Group>(null)
  const [currentGesture, setCurrentGesture] = useState<GestureType>(gestureType)
  const [transitionProgress, setTransitionProgress] = useState(1)
  const [previousGesture, setPreviousGesture] = useState<GestureType>(gestureType)

  // Handle gesture changes with smooth transitions
  useEffect(() => {
    if (gestureType !== currentGesture) {
      setPreviousGesture(currentGesture)
      setCurrentGesture(gestureType)
      setTransitionProgress(0)
    }
  }, [gestureType, currentGesture])

  // Auto-cycle through gestures if autoAnimate is true
  useEffect(() => {
    if (!autoAnimate) return

    const gestures: GestureType[] = ["idle", "point", "grab", "pinch", "swipe", "wave", "thumbsUp", "peace", "fist"]
    let currentIndex = 0

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % gestures.length
      setCurrentGesture(gestures[currentIndex])
      setTransitionProgress(0)
    }, 3000)

    return () => clearInterval(interval)
  }, [autoAnimate])

  // Animate the hand
  useFrame((state) => {
    if (!handRef.current) return

    const t = state.clock.getElapsedTime()

    // Base hand movement
    handRef.current.rotation.y = Math.sin(t / 3) * 0.3
    handRef.current.rotation.z = Math.cos(t / 4) * 0.1
    handRef.current.position.y = Math.sin(t / 4) * 0.1

    // Transition between gestures
    if (transitionProgress < 1) {
      setTransitionProgress(Math.min(1, transitionProgress + 0.03))
    }
  })

  // Get gesture description
  const getGestureDescription = (gesture: GestureType): string => {
    switch (gesture) {
      case "point":
        return "Cursor Control"
      case "grab":
        return "Object Selection"
      case "pinch":
        return "Zoom Control"
      case "swipe":
        return "Navigation"
      case "wave":
        return "Menu Activation"
      case "thumbsUp":
        return "Confirm Action"
      case "peace":
        return "Screenshot"
      case "fist":
        return "System Pause"
      default:
        return "Ready State"
    }
  }

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
        { x: -0.4, color: "#9B5DE5", delay: 0, finger: "pinky" }, // Purple
        { x: -0.2, color: "#9B5DE5", delay: 0.1, finger: "ring" }, // Purple
        { x: 0, color: "#00FFFF", delay: 0.2, finger: "middle" }, // Cyan
        { x: 0.2, color: "#9B5DE5", delay: 0.3, finger: "index" }, // Purple
        { x: 0.4, color: "#9B5DE5", delay: 0.4, finger: "thumb" }, // Purple
      ].map((finger, i) => (
        <RoboticFinger
          key={i}
          position={[finger.x, 0.1, -0.4]}
          color={finger.color}
          delay={finger.delay}
          isMiddle={i === 2}
          fingerType={finger.finger as FingerType}
          gestureType={currentGesture}
          previousGesture={previousGesture}
          transitionProgress={transitionProgress}
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

      {/* Glowing core - changes color based on gesture */}
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
          color={getGestureColor(currentGesture)}
          emissive={getGestureColor(currentGesture)}
          emissiveIntensity={1}
        />
      </mesh>

      {/* Gesture label */}
      {showLabels && (
        <group position={[0, -0.8, 0]}>
          <Text
            position={[0, 0, 0]}
            color="#00FFFF"
            fontSize={0.15}
            maxWidth={2}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            font="/fonts/Inter_Bold.json"
          >
            {currentGesture.toUpperCase()}
          </Text>
          <Text
            position={[0, -0.2, 0]}
            color="#ffffff"
            fontSize={0.1}
            maxWidth={2}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            font="/fonts/Inter_Regular.json"
          >
            {getGestureDescription(currentGesture)}
          </Text>
        </group>
      )}
    </group>
  )
}

// Helper function to get color based on gesture
function getGestureColor(gesture: GestureType): string {
  switch (gesture) {
    case "point":
      return "#00FFFF" // Cyan
    case "grab":
      return "#FF4D9D" // Pink
    case "pinch":
      return "#9B5DE5" // Purple
    case "swipe":
      return "#00FFFF" // Cyan
    case "wave":
      return "#9B5DE5" // Purple
    case "thumbsUp":
      return "#00FF00" // Green
    case "peace":
      return "#9B5DE5" // Purple
    case "fist":
      return "#FF4D9D" // Pink
    default:
      return "#00FFFF" // Cyan
  }
}

type FingerType = "thumb" | "index" | "middle" | "ring" | "pinky"

interface RoboticFingerProps {
  position: [number, number, number]
  color: string
  delay: number
  isMiddle?: boolean
  fingerType: FingerType
  gestureType: GestureType
  previousGesture: GestureType
  transitionProgress: number
}

function RoboticFinger({
  position,
  color,
  delay,
  isMiddle = false,
  fingerType,
  gestureType,
  previousGesture,
  transitionProgress,
}: RoboticFingerProps) {
  const fingerRef = useRef<THREE.Group>(null)

  // Get finger rotations based on gesture and finger type
  const getFingerRotations = (gesture: GestureType, finger: FingerType): [number, number, number] => {
    // Default rotation is [0, 0, 0] for each segment
    const defaultRotation: [number, number, number] = [0, 0, 0]

    switch (gesture) {
      case "idle":
        // Slightly curved fingers in idle position
        return [0.1, 0.1, 0.1]

      case "point":
        // Index finger extended, others curled
        if (finger === "index") return [0, 0, 0]
        return [0.8, 0.7, 0.6]

      case "grab":
        // All fingers curled inward
        return [1.2, 0.9, 0.7]

      case "pinch":
        // Thumb and index form a pinch, others slightly curled
        if (finger === "thumb") return [0, 0.5, 0.3]
        if (finger === "index") return [0.7, 0.5, 0.3]
        return [0.6, 0.4, 0.3]

      case "swipe":
        // Flat hand, fingers extended
        return [0, 0, 0]

      case "wave":
        // Fingers slightly spread and extended
        return [0, 0.1, 0.2]

      case "thumbsUp":
        // Thumb extended up, others curled
        if (finger === "thumb") return [-1.0, -0.5, -0.3]
        return [1.0, 0.8, 0.6]

      case "peace":
        // Index and middle extended, others curled
        if (finger === "index" || finger === "middle") return [0, 0, 0]
        return [1.0, 0.8, 0.6]

      case "fist":
        // All fingers tightly curled
        return [1.5, 1.2, 0.9]

      default:
        return defaultRotation
    }
  }

  // Get finger spread (side-to-side movement) based on gesture
  const getFingerSpread = (gesture: GestureType, finger: FingerType): number => {
    switch (gesture) {
      case "wave":
        // Fingers spread apart
        if (finger === "thumb") return 0.3
        if (finger === "index") return 0.1
        if (finger === "middle") return 0
        if (finger === "ring") return -0.1
        return -0.2

      case "peace":
        // Index and middle spread in V shape
        if (finger === "index") return 0.15
        if (finger === "middle") return -0.15
        return 0

      default:
        return 0
    }
  }

  // Get thumb position based on gesture
  const getThumbPosition = (gesture: GestureType): [number, number, number] => {
    if (fingerType !== "thumb") return [0, 0, 0]

    switch (gesture) {
      case "pinch":
        return [0.2, 0, 0.2] // Move toward index finger

      case "thumbsUp":
        return [0, 0.3, -0.2] // Move upward

      case "grab":
        return [0.3, 0, 0.3] // Move toward palm center

      default:
        return [0, 0, 0]
    }
  }

  useFrame((state) => {
    if (!fingerRef.current) return

    const t = state.clock.getElapsedTime() + delay * 10

    // Get current and previous rotations
    const currentRotations = getFingerRotations(gestureType, fingerType)
    const previousRotations = getFingerRotations(previousGesture, fingerType)

    // Get current and previous spread
    const currentSpread = getFingerSpread(gestureType, fingerType)
    const previousSpread = getFingerSpread(previousGesture, fingerType)

    // Get thumb position adjustments
    const thumbPosition = getThumbPosition(gestureType)
    const prevThumbPosition = getThumbPosition(previousGesture)

    // Apply interpolated rotations to finger segments
    if (fingerRef.current.children.length >= 3) {
      // Apply small idle animation if in idle state
      const idleAnimation = gestureType === "idle" ? Math.sin(t) * 0.1 : 0

      // Apply rotations to each segment with transition
      for (let i = 0; i < 3; i++) {
        const segment = fingerRef.current.children[i] as THREE.Group
        if (segment) {
          // Interpolate between previous and current rotation
          const interpolatedRotation =
            previousRotations[i] * (1 - transitionProgress) + currentRotations[i] * transitionProgress + idleAnimation

          segment.rotation.x = interpolatedRotation
        }
      }

      // Apply spread (side-to-side rotation)
      const interpolatedSpread = previousSpread * (1 - transitionProgress) + currentSpread * transitionProgress

      fingerRef.current.rotation.z = interpolatedSpread

      // Apply thumb position adjustments if this is the thumb
      if (fingerType === "thumb") {
        for (let i = 0; i < 3; i++) {
          fingerRef.current.position.x =
            position[0] + prevThumbPosition[0] * (1 - transitionProgress) + thumbPosition[0] * transitionProgress

          fingerRef.current.position.y =
            position[1] + prevThumbPosition[1] * (1 - transitionProgress) + thumbPosition[1] * transitionProgress

          fingerRef.current.position.z =
            position[2] + prevThumbPosition[2] * (1 - transitionProgress) + thumbPosition[2] * transitionProgress
        }
      }
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
