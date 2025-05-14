"use client"

import { motion } from "framer-motion"
import { Laptop, Server, ArrowRight, Code } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BackendConnection() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Connect to <span className="text-secondary">Backend</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the full power of GestureGuy by connecting to our Python backend for system-wide gesture control.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="w-full md:w-1/2 max-w-md"
          >
            <div className="rounded-xl overflow-hidden glassmorphism border border-secondary/30 glow-secondary p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mr-4">
                  <Server className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Python Backend</h3>
                  <p className="text-gray-400">System-wide gesture control</p>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center mr-3 mt-0.5">
                    <Code className="text-secondary" size={14} />
                  </div>
                  <span className="text-gray-300">Advanced computer vision algorithms</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center mr-3 mt-0.5">
                    <Code className="text-secondary" size={14} />
                  </div>
                  <span className="text-gray-300">Control your entire system with gestures</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center mr-3 mt-0.5">
                    <Code className="text-secondary" size={14} />
                  </div>
                  <span className="text-gray-300">Customizable gesture mappings</span>
                </li>
              </ul>

              <a href="http://localhost:5000" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="secondary"
                  className="w-full text-secondary-foreground hover:bg-secondary/80 glow-secondary"
                >
                  <Laptop className="mr-2" size={20} />
                  Connect to Backend
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
            className="w-full md:w-1/2 max-w-md"
          >
            <div className="aspect-video rounded-xl overflow-hidden border border-gray-800 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                    <Server className="text-secondary" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Backend Status</h3>
                  <p className="text-gray-300 mb-4">Connect to check the status of the backend server</p>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse mr-2"></span>
                    Waiting for connection...
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
