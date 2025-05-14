"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { HandIcon as Gesture, Camera, Layers, Settings, Wifi, Shield } from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import type * as THREE from "three"

export default function Features() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const features = [
    {
      icon: Gesture,
      title: "Real-time Gesture Recognition",
      description: "Advanced algorithms detect and interpret hand movements with millisecond precision.",
      color: "#00FFFF",
    },
    {
      icon: Camera,
      title: "Computer Vision Tracking",
      description: "Uses your webcam to track hand landmarks and interpret gestures in real-time.",
      color: "#9B5DE5",
    },
    {
      icon: Layers,
      title: "Platform Independent",
      description: "Works across all major operating systems and devices without compatibility issues.",
      color: "#FF4D9D",
    },
    {
      icon: Settings,
      title: "Custom Gesture Mapping",
      description: "Create and customize your own gesture commands for personalized control.",
      color: "#00FFFF",
    },
    {
      icon: Wifi,
      title: "IoT Compatibility",
      description: "Control smart home devices and IoT systems with intuitive hand movements.",
      color: "#9B5DE5",
    },
    {
      icon: Shield,
      title: "Secure Data Processing",
      description: "All processing happens locally on your device, ensuring your privacy.",
      color: "#FF4D9D",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="features" className="py-20 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful <span className="text-primary">Features</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            GestureGuy combines cutting-edge technology with intuitive design to deliver a seamless gesture control
            experience.
          </p>
        </motion.div>

        {/* 3D Feature Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="w-full h-[300px] mb-16"
        >
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <FeatureVisualization hoveredFeature={hoveredFeature} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
              className="relative group"
            >
              <div
                className="h-full p-8 rounded-xl glassmorphism border border-gray-800 transition-all duration-300 hover:border-primary/50"
                style={{
                  boxShadow: hoveredFeature === index ? `0 0 20px ${feature.color}40` : "none",
                }}
              >
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center mb-6 transition-all duration-300"
                  style={{
                    backgroundColor: `${feature.color}20`,
                    color: feature.color,
                  }}
                >
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: hoveredFeature === index ? "100%" : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${feature.color}, ${feature.color}80)`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// 3D Feature Visualization Component
function FeatureVisualization({ hoveredFeature }: { hoveredFeature: number | null }) {
  const groupRef = useRef<THREE.Group>(null)

  // Colors matching the feature colors
  const colors = [
    "#00FFFF", // Cyan
    "#9B5DE5", // Purple
    "#FF4D9D", // Pink
    "#00FFFF", // Cyan
    "#9B5DE5", // Purple
    "#FF4D9D", // Pink
  ]

  return (
    <group ref={groupRef}>
      {/* Central sphere representing the core system */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00FFFF"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Orbiting feature nodes */}
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <FeatureNode
          key={index}
          index={index}
          isHovered={hoveredFeature === index}
          color={colors[index]}
          totalNodes={6}
        />
      ))}

      {/* Connection lines */}
      <ConnectionLines hoveredFeature={hoveredFeature} />
    </group>
  )
}

// Individual feature node
function FeatureNode({
  index,
  isHovered,
  color,
  totalNodes,
}: {
  index: number
  isHovered: boolean
  color: string
  totalNodes: number
}) {
  const nodeRef = useRef<THREE.Mesh>(null)

  // Calculate position on a circle
  const angle = (index / totalNodes) * Math.PI * 2
  const radius = 2
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius

  return (
    <mesh ref={nodeRef} position={[x, y, 0]} scale={isHovered ? 1.5 : 1}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive={color}
        emissiveIntensity={isHovered ? 1 : 0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

// Connection lines between core and features
function ConnectionLines({ hoveredFeature }: { hoveredFeature: number | null }) {
  const linesRef = useRef<THREE.Group>(null)

  // Colors matching the feature colors
  const colors = [
    "#00FFFF", // Cyan
    "#9B5DE5", // Purple
    "#FF4D9D", // Pink
    "#00FFFF", // Cyan
    "#9B5DE5", // Purple
    "#FF4D9D", // Pink
  ]

  return (
    <group ref={linesRef}>
      {[0, 1, 2, 3, 4, 5].map((index) => {
        // Calculate position on a circle
        const angle = (index / 6) * Math.PI * 2
        const radius = 2
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        return (
          <line key={index}>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([0, 0, 0, x, y, 0])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              attach="material"
              color={colors[index]}
              opacity={hoveredFeature === index ? 1 : 0.3}
              transparent
              linewidth={hoveredFeature === index ? 2 : 1}
            />
          </line>
        )
      })}
    </group>
  )
}
