"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import RoboticHand, { type GestureType } from "../three-d/robotic-hand"
import { Button } from "@/components/ui/button"
import { Hand, Play } from "lucide-react"

export default function GestureAnimations() {
  const [activeGesture, setActiveGesture] = useState<GestureType>("idle")
  const [autoPlay, setAutoPlay] = useState(false)

  const gestures: { id: GestureType; name: string; description: string }[] = [
    {
      id: "idle",
      name: "Idle",
      description: "Default resting position with slightly curved fingers",
    },
    {
      id: "point",
      name: "Point",
      description: "Index finger extended for precise cursor control",
    },
    {
      id: "grab",
      name: "Grab",
      description: "All fingers curled inward to select and move objects",
    },
    {
      id: "pinch",
      name: "Pinch",
      description: "Thumb and index finger form a pinch for precise manipulation",
    },
    {
      id: "swipe",
      name: "Swipe",
      description: "Flat hand with extended fingers for navigation gestures",
    },
    {
      id: "wave",
      name: "Wave",
      description: "Fingers spread and extended to activate menus or greet",
    },
    {
      id: "thumbsUp",
      name: "Thumbs Up",
      description: "Thumb extended upward to confirm actions or approve",
    },
    {
      id: "peace",
      name: "Peace",
      description: "Index and middle fingers extended in V shape for screenshots",
    },
    {
      id: "fist",
      name: "Fist",
      description: "All fingers tightly curled to pause the system or grab",
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden">
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
            Gesture <span className="text-primary">Animations</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the different hand gestures that GestureGuy recognizes and how they control your digital experience.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* 3D Hand Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="lg:w-1/2 w-full"
          >
            <div className="rounded-xl overflow-hidden glassmorphism border border-gray-800 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">
                  <span className="text-primary">{activeGesture.charAt(0).toUpperCase() + activeGesture.slice(1)}</span>{" "}
                  Gesture
                </h3>
                <Button
                  variant={autoPlay ? "default" : "outline"}
                  className={autoPlay ? "bg-primary text-primary-foreground" : "border-primary text-primary"}
                  onClick={() => setAutoPlay(!autoPlay)}
                >
                  <Play className="mr-2" size={16} />
                  {autoPlay ? "Stop Auto Play" : "Auto Play"}
                </Button>
              </div>

              <div className="aspect-square w-full relative">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} />

                  <RoboticHand gestureType={activeGesture} autoAnimate={autoPlay} showLabels={true} />

                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 3}
                  />
                </Canvas>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-medium mb-2">Description</h4>
                <p className="text-gray-300">
                  {gestures.find((g) => g.id === activeGesture)?.description ||
                    "Default hand position for tracking and recognition."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Gesture Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="lg:w-1/2 w-full"
          >
            <div className="rounded-xl overflow-hidden glassmorphism border border-gray-800 p-6">
              <h3 className="text-2xl font-bold mb-6">Available Gestures</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gestures.map((gesture) => (
                  <motion.button
                    key={gesture.id}
                    onClick={() => {
                      setActiveGesture(gesture.id)
                      setAutoPlay(false)
                    }}
                    className={`p-4 rounded-lg text-left transition-all ${
                      activeGesture === gesture.id
                        ? "bg-primary/20 border border-primary/50"
                        : "bg-gray-800/50 border border-gray-700 hover:border-gray-500"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          activeGesture === gesture.id ? "bg-primary/20" : "bg-gray-700/50"
                        }`}
                      >
                        <Hand size={20} className={activeGesture === gesture.id ? "text-primary" : "text-gray-300"} />
                      </div>
                      <div>
                        <h4 className={`font-bold ${activeGesture === gesture.id ? "text-primary" : "text-white"}`}>
                          {gesture.name}
                        </h4>
                        <p className="text-sm text-gray-400 line-clamp-1">{gesture.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="text-lg font-medium mb-2 flex items-center">
                  <Hand className="mr-2 text-primary" size={20} />
                  Pro Tip
                </h4>
                <p className="text-gray-300 text-sm">
                  GestureGuy can be trained to recognize custom gestures specific to your workflow. Create personalized
                  gesture mappings for your most frequently used commands.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
