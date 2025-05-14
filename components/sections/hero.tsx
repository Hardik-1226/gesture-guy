"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import dynamic from "next/dynamic"
import { ArrowRight, Laptop } from "lucide-react"

// Dynamically import Three.js components to avoid SSR issues
const ThreeScene = dynamic(() => import("@/components/three-d/three-scene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
})

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.1) 0%, rgba(10, 10, 10, 0) 70%)",
      }}
    >
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Enhanced background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/80" />

      <div className="container mx-auto px-4 z-20 flex flex-col lg:flex-row items-center justify-between gap-12 relative">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
              <span className="text-gradient">GestureGuy</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 text-gray-300"
            >
              Control your digital world with a flick of your hand.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/demo">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/80 glow text-lg py-6 px-8">
                  Try Demo
                </Button>
              </Link>
              <a href="http://localhost:5000" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="secondary"
                  className="text-secondary-foreground hover:bg-secondary/80 glow-secondary text-lg py-6 px-8"
                >
                  <Laptop className="mr-2" size={20} />
                  Connect to Backend
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </a>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 text-lg py-6 px-8">
                Explore Features
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced 3D visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 h-[400px] md:h-[500px] w-full max-w-[500px] relative"
        >
          <ThreeScene />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-10 left-0 right-0 flex justify-center z-20"
      >
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-400 mb-2">Scroll to explore</p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="w-1 h-2 bg-primary rounded-full mt-2"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
