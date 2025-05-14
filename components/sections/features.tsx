"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { HandIcon as Gesture, Camera, Layers, Settings, Wifi, Shield } from "lucide-react"

export default function Features() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

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
    <section id="features" className="py-20 relative overflow-hidden">
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
