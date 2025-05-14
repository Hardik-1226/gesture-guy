"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Camera, Play, Info, X, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import VirtualDesktop from "@/components/virtual-desktop"
import { HandTracker } from "@/lib/hand-tracker"

export default function DemoPage() {
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)
  const [showInstructions, setShowInstructions] = useState(true)
  const [activeGesture, setActiveGesture] = useState<string | null>(null)
  const [handLandmarks, setHandLandmarks] = useState<any[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const handTrackerRef = useRef<HandTracker | null>(null)

  // Gestures for the demo
  const gestures = [
    { id: "cursor", name: "Cursor Movement", description: "Move your middle finger to control the cursor" },
    { id: "click", name: "Click", description: "Bring your index finger and thumb together" },
    { id: "scroll", name: "Scroll", description: "Point your thumb up (scroll up) or down (scroll down)" },
    {
      id: "volume",
      name: "Volume Control",
      description: "Make a V shape with index and middle fingers (up) or fold them (down)",
    },
    { id: "zoom", name: "Zoom", description: "Pinch with thumb and pinky for zoom in/out" },
  ]

  // Memoize callbacks to prevent infinite loops
  const handleGestureDetected = useCallback((gesture) => {
    setActiveGesture(gesture.id)
  }, [])

  const handleLandmarksDetected = useCallback((landmarks) => {
    setHandLandmarks(landmarks)
  }, [])

  // Initialize camera
  const initCamera = async () => {
    setIsLoading(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraPermission(true)

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          // Initialize hand tracker
          if (canvasRef.current) {
            const handTracker = new HandTracker(videoRef.current!, canvasRef.current)
            handTrackerRef.current = handTracker

            // Assign the memoized callbacks
            handTracker.onGestureDetected = handleGestureDetected
            handTracker.onLandmarksDetected = handleLandmarksDetected

            handTracker.start()
            setIsLoading(false)
          }
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setCameraPermission(false)
      setIsLoading(false)
    }
  }

  // Initialize camera when component mounts
  useEffect(() => {
    if (cameraActive && videoRef.current && !videoRef.current.srcObject) {
      initCamera()
    }

    return () => {
      // Clean up
      if (handTrackerRef.current) {
        handTrackerRef.current.stop()
      }
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        const tracks = stream.getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [cameraActive, handleGestureDetected, handleLandmarksDetected])

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center text-primary hover:text-primary/80 transition-colors">
          <ArrowLeft className="mr-2" size={20} />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-2xl font-bold text-gradient">GestureGuy Demo</h1>
        <Button variant="ghost" size="icon" onClick={() => setShowInstructions(!showInstructions)}>
          <Info size={20} />
        </Button>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1" ref={containerRef}>
            <div className="rounded-xl overflow-hidden glassmorphism border border-gray-800 p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Hand Gesture Recognition</h2>
                <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </Button>
              </div>

              <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
                {!cameraActive ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Camera size={48} className="text-gray-600 mb-4" />
                    <p className="text-gray-400 mb-4">Camera access required for gesture recognition</p>
                    <Button
                      onClick={() => setCameraActive(true)}
                      className="bg-primary text-primary-foreground hover:bg-primary/80 glow"
                    >
                      <Camera className="mr-2" size={16} />
                      Start Camera
                    </Button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <canvas
                      ref={canvasRef}
                      width={640}
                      height={480}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                          <p className="text-primary">Loading hand tracking model...</p>
                        </div>
                      </div>
                    )}
                    {cameraPermission === false && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                        <div className="text-center p-6">
                          <p className="text-red-500 mb-4">Camera access denied</p>
                          <p className="text-gray-400 mb-4">
                            Please allow camera access to use the gesture recognition demo
                          </p>
                          <Button
                            onClick={() => setCameraActive(true)}
                            className="bg-primary text-primary-foreground hover:bg-primary/80"
                          >
                            Try Again
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400">
                    Status:{" "}
                    <span className={cameraActive ? "text-green-500" : "text-red-500"}>
                      {cameraActive ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  {cameraActive ? (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (handTrackerRef.current) {
                          handTrackerRef.current.stop()
                        }
                        if (videoRef.current?.srcObject) {
                          const stream = videoRef.current.srcObject as MediaStream
                          const tracks = stream.getTracks()
                          tracks.forEach((track) => track.stop())
                          videoRef.current.srcObject = null
                        }
                        setCameraActive(false)
                      }}
                    >
                      Stop Camera
                    </Button>
                  ) : (
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/80"
                      onClick={() => setCameraActive(true)}
                    >
                      <Play className="mr-2" size={16} />
                      Start Demo
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Virtual Desktop */}
            <div className="rounded-xl overflow-hidden glassmorphism border border-gray-800 p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Virtual Desktop</h2>
              <p className="text-gray-400 mb-4">
                Use hand gestures to interact with this virtual environment. Your gestures will control the cursor and
                perform actions.
              </p>
              <VirtualDesktop activeGesture={activeGesture} handLandmarks={handLandmarks} />
            </div>

            {/* Active gesture display */}
            <div className="rounded-xl overflow-hidden glassmorphism border border-gray-800 p-6">
              <h2 className="text-xl font-bold mb-4">Detected Gesture</h2>
              <div className="h-20 flex items-center justify-center bg-black/50 rounded-lg">
                {activeGesture ? (
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-primary">
                      {gestures.find((g) => g.id === activeGesture)?.name || "None"}
                    </h3>
                    <p className="text-gray-400 text-sm">{gestures.find((g) => g.id === activeGesture)?.description}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No gesture detected</p>
                )}
              </div>
            </div>
          </div>

          {/* Instructions panel */}
          {showInstructions && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="lg:w-96 w-full"
            >
              <div className="rounded-xl overflow-hidden glassmorphism border border-gray-800 p-6 sticky top-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Gesture Instructions</h2>
                  <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setShowInstructions(false)}>
                    <X size={20} />
                  </Button>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {gestures.map((gesture) => (
                    <div
                      key={gesture.id}
                      className={`p-4 rounded-lg transition-colors ${
                        activeGesture === gesture.id
                          ? "bg-primary/20 border border-primary/50"
                          : "bg-gray-900/50 border border-gray-800"
                      }`}
                    >
                      <h3 className="font-bold text-lg mb-1">{gesture.name}</h3>
                      <p className="text-gray-300 text-sm">{gesture.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800">
                  <h3 className="font-bold mb-2">How It Works</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    This demo uses advanced computer vision to track your hand movements in real-time through your
                    webcam. The gestures you make are recognized and translated into actions in the virtual desktop.
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    Try moving your hand in front of the camera and see how the system responds to different gestures.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
