"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  const timelineItems = [
    {
      year: "1960s",
      title: "Mouse Invention",
      description: "The first computer mouse was invented, revolutionizing how we interact with computers.",
      icon: "🖱️",
    },
    {
      year: "1980s",
      title: "Keyboard Era",
      description: "Keyboards became the standard input device for personal computers worldwide.",
      icon: "⌨️",
    },
    {
      year: "2010s",
      title: "Touch Revolution",
      description: "Touchscreens changed mobile computing and introduced gesture controls.",
      icon: "👆",
    },
    {
      year: "2025",
      title: "GestureGuy Launch",
      description: "The future of interaction: control devices with hand gestures in the air.",
      icon: "✋",
    },
  ]

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The Future of <span className="text-primary">Interaction</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            GestureGuy is a revolutionary software interface that replaces traditional input devices with intuitive hand
            gestures tracked by computer vision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden glassmorphism border border-primary/30 glow">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <h3 className="text-3xl font-bold mb-4">What is GestureGuy?</h3>
                  <p className="text-gray-300 mb-6">
                    GestureGuy is a software-only solution that transforms how you interact with your devices. Using
                    advanced computer vision algorithms, it interprets hand gestures captured by your webcam and
                    translates them into precise digital commands.
                  </p>
                  <p className="text-gray-300">
                    No additional hardware required — just your existing webcam and our revolutionary software that
                    understands your natural movements.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div ref={ref}>
            <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-primary before:to-accent">
              {timelineItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="mb-12 relative"
                >
                  <div className="absolute -left-[41px] w-[33px] h-[33px] rounded-full bg-background border-2 border-primary flex items-center justify-center text-xl">
                    {item.icon}
                  </div>
                  <div className="pb-4">
                    <span className="text-sm text-primary font-medium">{item.year}</span>
                    <h3 className="text-xl font-bold mt-1">{item.title}</h3>
                    <p className="text-gray-300 mt-2">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
