"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(180) // 3 minutes in seconds
  const waveformControls = useAnimation()
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)

      // Animate waveform
      waveformControls.start({
        y: [0, -10, 0, -5, 0, -15, 0],
        transition: {
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        },
      })
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }

      // Stop waveform animation
      waveformControls.stop()
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [isPlaying, duration, waveformControls])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    setCurrentTime(percentage * duration)
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
            Music & <span className="text-primary">Vibes</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Control your music with simple hand gestures. Experience the perfect soundtrack for your workflow.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-xl overflow-hidden glassmorphism border border-gray-800 p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/3">
                <div className="aspect-square rounded-lg overflow-hidden relative glow-secondary">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Lofi Beats</h3>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-bold mb-2">Ambient Flow</h3>
                <p className="text-gray-400 mb-6">AirBoard Soundtrack</p>

                {/* Progress Bar */}
                <div className="h-2 bg-gray-800 rounded-full mb-2 cursor-pointer" onClick={handleProgressClick}>
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm text-gray-400 mb-6">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-800">
                      <SkipBack size={20} />
                    </Button>

                    <Button
                      size="icon"
                      className={`rounded-full ${
                        isPlaying
                          ? "bg-primary text-primary-foreground hover:bg-primary/80"
                          : "bg-white text-black hover:bg-white/80"
                      }`}
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </Button>

                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-800">
                      <SkipForward size={20} />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Volume2 size={18} className="text-gray-400" />
                    <div className="w-24 h-1 bg-gray-800 rounded-full">
                      <div className="h-full w-3/4 bg-gray-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Waveform */}
            <div className="mt-8 h-24 flex items-center justify-center">
              <div className="flex items-end space-x-1 h-full">
                {Array.from({ length: 40 }).map((_, i) => {
                  const height = Math.random() * 100
                  const isActive = i / 40 < currentTime / duration

                  return (
                    <motion.div
                      key={i}
                      custom={i}
                      animate={isPlaying ? waveformControls : {}}
                      className="w-1.5 rounded-t-sm"
                      style={{
                        height: `${height}%`,
                        backgroundColor: isActive
                          ? i % 3 === 0
                            ? "#00FFFF"
                            : i % 3 === 1
                              ? "#9B5DE5"
                              : "#FF4D9D"
                          : "#333333",
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
