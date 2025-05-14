"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { Hand, ToggleLeft, ToggleRight, Zap, Cpu, Wifi, Settings, Activity } from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import RoboticHand, { type GestureType } from "../three-d/robotic-hand"

export default function SoftwarePreview() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [activeButton, setActiveButton] = useState<string | null>(null)
  const [activeGesture, setActiveGesture] = useState<GestureType>("idle")
  const containerRef = useRef<HTMLDivElement>(null)
  const handControls = useAnimation()

  const dashboardButtons = [
    { id: "gesture", icon: Hand, label: "Gestures", gesture: "point" as GestureType },
    { id: "performance", icon: Zap, label: "Performance", gesture: "peace" as GestureType },
    { id: "system", icon: Cpu, label: "System", gesture: "grab" as GestureType },
    { id: "connection", icon: Wifi, label: "Connection", gesture: "wave" as GestureType },
    { id: "settings", icon: Settings, label: "Settings", gesture: "pinch" as GestureType },
    { id: "analytics", icon: Activity, label: "Analytics", gesture: "thumbsUp" as GestureType },
  ]

  useEffect(() => {
    if (!isSimulating) {
      setActiveButton(null)
      setActiveGesture("idle")
      return
    }

    // Simulate hand movement between dashboard buttons
    let currentIndex = 0
    const interval = setInterval(() => {
      const button = dashboardButtons[currentIndex]
      setActiveButton(button.id)
      setActiveGesture(button.gesture)
      currentIndex = (currentIndex + 1) % dashboardButtons.length

      // Get button position
      const buttonElement = document.getElementById(`dashboard-button-${button.id}`)
      if (buttonElement && containerRef.current) {
        const rect = buttonElement.getBoundingClientRect()
        const containerRect = containerRef.current.getBoundingClientRect()

        // Calculate position relative to container
        const x = rect.left - containerRect.left + rect.width / 2
        const y = rect.top - containerRect.top + rect.height / 2

        // Animate hand to button
        handControls.start({
          x,
          y,
          transition: { type: "spring", stiffness: 100, damping: 15 },
        })
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isSimulating, handControls])

  return (
    <section id="preview" className="py-20 relative overflow-hidden">
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
            Experience <span className="text-primary">GestureGuy</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how GestureGuy transforms your interaction with digital interfaces through intuitive gesture control.
          </p>
        </motion.div>

        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative w-full max-w-4xl h-[600px] rounded-xl overflow-hidden glassmorphism border border-gray-800 mb-8"
            ref={containerRef}
          >
            {/* Dashboard UI */}
            <div className="absolute inset-0 p-6 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-primary">GestureGuy Dashboard</h3>
                  <p className="text-gray-400">Gesture Control Interface</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400">Status: {isSimulating ? "Active" : "Standby"}</div>
                  <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Panel */}
                <div className="col-span-1 bg-black/30 rounded-lg p-4 border border-gray-800">
                  <h4 className="text-lg font-medium mb-4">Control Panel</h4>
                  <div className="space-y-4">
                    {dashboardButtons.map((button) => (
                      <motion.button
                        key={button.id}
                        id={`dashboard-button-${button.id}`}
                        className={`w-full flex items-center p-3 rounded-lg transition-all ${
                          activeButton === button.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (isSimulating) return
                          setActiveButton(button.id)
                          setActiveGesture(button.gesture)
                        }}
                      >
                        <button.icon className="mr-3" size={18} />
                        <span>{button.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Main Panel - 3D Visualization */}
                <div className="col-span-2 bg-black/30 rounded-lg p-4 border border-gray-800 flex flex-col">
                  <h4 className="text-lg font-medium mb-4">Gesture Visualization</h4>
                  <div className="flex-1 relative">
                    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                      <ambientLight intensity={0.5} />
                      <pointLight position={[10, 10, 10]} intensity={1} />
                      <RoboticHand gestureType={activeGesture} />
                      <OrbitControls enableZoom={false} enablePan={false} />
                    </Canvas>

                    {!isSimulating && !activeButton && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <p className="text-gray-400">Start simulation or select a control to see gesture tracking</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Gesture Accuracy</p>
                      <p className="text-lg font-medium text-primary">98.7%</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Response Time</p>
                      <p className="text-lg font-medium text-primary">12ms</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Active Gestures</p>
                      <p className="text-lg font-medium text-primary">8</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Animated Hand Cursor */}
            {isSimulating && (
              <motion.div
                className="absolute w-10 h-10 pointer-events-none"
                animate={handControls}
                initial={{ x: 0, y: 0 }}
              >
                <div className="relative">
                  <Hand className="text-primary" size={24} />
                  <div className="absolute -inset-1 bg-primary rounded-full opacity-20 animate-pulse" />
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex items-center space-x-4"
          >
            <span className="text-gray-300">Start Gesture Simulation</span>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
              style={{
                backgroundColor: isSimulating ? "#00FFFF" : "rgba(255, 255, 255, 0.1)",
              }}
            >
              <span
                className={`${
                  isSimulating ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 rounded-full bg-white transition-transform`}
              />
              {isSimulating ? (
                <ToggleRight className="absolute right-0 text-primary-foreground" size={24} />
              ) : (
                <ToggleLeft className="absolute left-0 text-gray-400" size={24} />
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
