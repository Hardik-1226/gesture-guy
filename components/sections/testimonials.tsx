"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const testimonials = [
    {
      name: "Tony Stark",
      role: "Tech Innovator",
      quote: "AirBoard is the future of human-computer interaction. It's like having a digital extension of your mind.",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Elon Musk",
      role: "Space Explorer",
      quote:
        "This technology is revolutionary. I've integrated AirBoard into all my workstations for maximum productivity.",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Dr. Jane Foster",
      role: "Quantum Physicist",
      quote:
        "The precision of AirBoard's gesture recognition is unparalleled. It's transformed how I interact with complex data visualizations.",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ]

  const nextTestimonial = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

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
            Tech <span className="text-primary">Hype</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See what industry leaders are saying about AirBoard's revolutionary technology.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute -top-20 -left-20 text-primary/10">
            <Quote size={200} />
          </div>

          <div className="relative h-[300px] overflow-hidden">
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-2 border-primary glow">
                  <img
                    src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xl md:text-2xl italic mb-6 text-gray-200">"{testimonials[currentIndex].quote}"</p>
                <h3 className="text-lg font-bold text-primary">{testimonials[currentIndex].name}</h3>
                <p className="text-gray-400">{testimonials[currentIndex].role}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full border border-gray-700 hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1)
                    setCurrentIndex(index)
                  }}
                  className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-primary" : "bg-gray-700"}`}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full border border-gray-700 hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
