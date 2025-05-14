"use client"

import { useState, useRef, useEffect } from "react"
import { Folder, FileText, ImageIcon, Settings, Volume2, VolumeX, Search, Maximize, Minimize, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VirtualDesktopProps {
  activeGesture: string | null
  handLandmarks: any[]
}

export default function VirtualDesktop({ activeGesture, handLandmarks }: VirtualDesktopProps) {
  const [cursorPosition, setCursorPosition] = useState({ x: 300, y: 200 })
  const [activeWindow, setActiveWindow] = useState<string | null>(null)
  const [windowPositions, setWindowPositions] = useState({
    browser: { x: 50, y: 50, width: 500, height: 300, minimized: false },
    fileExplorer: { x: 150, y: 100, width: 400, height: 250, minimized: false },
    settings: { x: 200, y: 150, width: 350, height: 200, minimized: false },
  })
  const [volume, setVolume] = useState(50)
  const [zoom, setZoom] = useState(100)
  const [scrollPosition, setScrollPosition] = useState(0)
  const desktopRef = useRef<HTMLDivElement>(null)

  // Process active gesture
  useEffect(() => {
    if (!activeGesture) return

    // Debounce gesture handling
    const timer = setTimeout(() => {
      // Handle different gestures
      switch (activeGesture) {
        case "click":
          handleClick()
          break
        case "scroll-up":
          setScrollPosition((prev) => Math.max(0, prev - 20))
          break
        case "scroll-down":
          setScrollPosition((prev) => prev + 20)
          break
        case "volume-up":
          setVolume((prev) => Math.min(100, prev + 10))
          break
        case "volume-down":
          setVolume((prev) => Math.max(0, prev - 10))
          break
        case "zoom-in":
          setZoom((prev) => Math.min(150, prev + 10))
          break
        case "zoom-out":
          setZoom((prev) => Math.max(50, prev - 10))
          break
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [activeGesture])

  // Update cursor position based on hand landmarks
  useEffect(() => {
    if (handLandmarks && handLandmarks.length > 0 && desktopRef.current) {
      // Use the middle finger tip (landmark 12) for cursor position
      const middleFingerTip = handLandmarks[12]
      if (middleFingerTip) {
        const rect = desktopRef.current.getBoundingClientRect()
        const x = rect.width * (1 - middleFingerTip.x)
        const y = rect.height * middleFingerTip.y
        setCursorPosition({ x, y })
      }
    }
  }, [handLandmarks])

  // Handle click action
  const handleClick = () => {
    // Check if cursor is over any window
    const windows = ["browser", "fileExplorer", "settings"]
    for (const window of windows) {
      const pos = windowPositions[window as keyof typeof windowPositions]
      if (
        cursorPosition.x >= pos.x &&
        cursorPosition.x <= pos.x + pos.width &&
        cursorPosition.y >= pos.y &&
        cursorPosition.y <= pos.y + pos.height &&
        !pos.minimized
      ) {
        setActiveWindow(window)
        return
      }
    }

    // Check if cursor is over desktop icons
    const iconSize = 80
    const iconPositions = [
      { id: "browser", x: 40, y: 40 },
      { id: "fileExplorer", x: 40, y: 130 },
      { id: "settings", x: 40, y: 220 },
    ]

    for (const icon of iconPositions) {
      if (
        cursorPosition.x >= icon.x &&
        cursorPosition.x <= icon.x + iconSize &&
        cursorPosition.y >= icon.y &&
        cursorPosition.y <= icon.y + iconSize
      ) {
        // Open the window
        setWindowPositions((prev) => ({
          ...prev,
          [icon.id]: {
            ...prev[icon.id as keyof typeof prev],
            minimized: false,
          },
        }))
        setActiveWindow(icon.id)
        return
      }
    }

    // If clicked elsewhere, deselect active window
    setActiveWindow(null)
  }

  // Handle window actions
  const handleWindowAction = (window: string, action: "close" | "minimize" | "maximize") => {
    if (action === "close") {
      setActiveWindow(null)
    } else if (action === "minimize") {
      setWindowPositions((prev) => ({
        ...prev,
        [window]: {
          ...prev[window as keyof typeof prev],
          minimized: true,
        },
      }))
      setActiveWindow(null)
    } else if (action === "maximize") {
      // Toggle maximize
    }
  }

  return (
    <div
      ref={desktopRef}
      className="relative w-full h-[500px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden border border-gray-700"
    >
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col space-y-8">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <Search className="text-white" size={24} />
          </div>
          <span className="text-xs text-white mt-1">Browser</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
            <Folder className="text-white" size={24} />
          </div>
          <span className="text-xs text-white mt-1">Files</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center">
            <Settings className="text-white" size={24} />
          </div>
          <span className="text-xs text-white mt-1">Settings</span>
        </div>
      </div>

      {/* Windows */}
      {!windowPositions.browser.minimized && (
        <div
          className={`absolute rounded-lg overflow-hidden shadow-lg ${
            activeWindow === "browser" ? "border-2 border-primary" : "border border-gray-600"
          }`}
          style={{
            left: windowPositions.browser.x,
            top: windowPositions.browser.y,
            width: windowPositions.browser.width,
            height: windowPositions.browser.height,
            zIndex: activeWindow === "browser" ? 10 : 1,
          }}
        >
          <div className="bg-gray-800 p-2 flex items-center justify-between">
            <div className="flex items-center">
              <Search size={16} className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-300">Web Browser</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full bg-yellow-500 hover:bg-yellow-600"
                onClick={() => handleWindowAction("browser", "minimize")}
              >
                <Minimize size={10} className="text-yellow-800" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full bg-green-500 hover:bg-green-600"
                onClick={() => handleWindowAction("browser", "maximize")}
              >
                <Maximize size={10} className="text-green-800" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full bg-red-500 hover:bg-red-600"
                onClick={() => handleWindowAction("browser", "close")}
              >
                <X size={10} className="text-red-800" />
              </Button>
            </div>
          </div>
          <div className="bg-white p-2 h-[calc(100%-32px)] overflow-hidden">
            <div
              className="w-full h-full overflow-y-auto"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top left",
                scrollTop: scrollPosition,
              }}
            >
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800">GestureGuy Demo Page</h2>
                <p className="text-gray-600 mt-2">
                  This is a virtual browser window. You can control it using hand gestures:
                </p>
                <ul className="list-disc list-inside text-gray-600 mt-2">
                  <li>Use your middle finger to move the cursor</li>
                  <li>Pinch your thumb and index finger to click</li>
                  <li>Point your thumb up or down to scroll</li>
                </ul>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-bold text-gray-700">Current Zoom Level: {zoom}%</h3>
                  <div className="w-full bg-gray-300 h-2 rounded-full mt-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${((zoom - 50) / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies
                    tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget
                    ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                  </p>
                  <p className="text-gray-600 mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies
                    tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget
                    ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!windowPositions.fileExplorer.minimized && (
        <div
          className={`absolute rounded-lg overflow-hidden shadow-lg ${
            activeWindow === "fileExplorer" ? "border-2 border-primary" : "border border-gray-600"
          }`}
          style={{
            left: windowPositions.fileExplorer.x,
            top: windowPositions.fileExplorer.y,
            width: windowPositions.fileExplorer.width,
            height: windowPositions.fileExplorer.height,
            zIndex: activeWindow === "fileExplorer" ? 10 : 1,
          }}
        >
          <div className="bg-gray-800 p-2 flex items-center justify-between">
            <div className="flex items-center">
              <Folder size={16} className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-300">File Explorer</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full bg-yellow-500 hover:bg-yellow-600"
                onClick={() => handleWindowAction("fileExplorer", "minimize")}
              >
                <Minimize size={10} className="text-yellow-800" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full bg-green-500 hover:bg-green-600"
                onClick={() => handleWindowAction("fileExplorer", "maximize")}
              >
                <Maximize size={10} className="text-green-800" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full bg-red-500 hover:bg-red-600"
                onClick={() => handleWindowAction("fileExplorer", "close")}
              >
                <X size={10} className="text-red-800" />
              </Button>
            </div>
          </div>
          <div className="bg-gray-700 p-2 h-[calc(100%-32px)] overflow-auto">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="text-blue-300" size={24} />
                </div>
                <span className="text-xs text-gray-300 mt-1">Document.txt</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="text-green-300" size={24} />
                </div>
                <span className="text-xs text-gray-300 mt-1">Spreadsheet.xlsx</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <ImageIcon className="text-purple-300" size={24} />
                </div>
                <span className="text-xs text-gray-300 mt-1">Photo.jpg</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!windowPositions.settings.minimized && (
        <div
          className={`absolute rounded-lg overflow-hidden shadow-lg ${
            activeWindow === "settings" ? "border-2 border-primary" : "border border-gray-600"
          }`}
          style={{
            left: windowPositions.settings.x,
            top: windowPositions.settings.y,
            width: windowPositions.settings.width,
            height: windowPositions.settings.height,
            zIndex: activeWindow === "settings" ? 10 : 1,
          }}
        >
          <div className="bg-gray-800 p-2 flex items-center justify-between">
            <div className="flex items-center">
              <Settings size={16} className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-300">Settings</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full bg-yellow-500 hover:bg-yellow-600"
                onClick={() => handleWindowAction("settings", "minimize")}
              >
                <Minimize size={10} className="text-yellow-800" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full bg-green-500 hover:bg-green-600"
                onClick={() => handleWindowAction("settings", "maximize")}
              >
                <Maximize size={10} className="text-green-800" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full bg-red-500 hover:bg-red-600"
                onClick={() => handleWindowAction("settings", "close")}
              >
                <X size={10} className="text-red-800" />
              </Button>
            </div>
          </div>
          <div className="bg-gray-700 p-4 h-[calc(100%-32px)] overflow-auto">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {volume > 0 ? (
                    <Volume2 size={16} className="text-gray-300 mr-2" />
                  ) : (
                    <VolumeX size={16} className="text-gray-300 mr-2" />
                  )}
                  <span className="text-sm text-gray-300">Volume: {volume}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${volume}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Search size={16} className="text-gray-300 mr-2" />
                  <span className="text-sm text-gray-300">Zoom: {zoom}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${((zoom - 50) / 100) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-900 border-t border-gray-700 flex items-center px-4">
        <div className="flex space-x-2">
          {Object.entries(windowPositions).map(([key, value]) => (
            <Button
              key={key}
              variant="ghost"
              className={`h-8 px-2 text-xs ${
                activeWindow === key ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              onClick={() => {
                if (value.minimized) {
                  setWindowPositions((prev) => ({
                    ...prev,
                    [key]: {
                      ...prev[key as keyof typeof prev],
                      minimized: false,
                    },
                  }))
                }
                setActiveWindow(key)
              }}
            >
              {key === "browser" && <Search size={12} className="mr-1" />}
              {key === "fileExplorer" && <Folder size={12} className="mr-1" />}
              {key === "settings" && <Settings size={12} className="mr-1" />}
              {key === "browser" && "Browser"}
              {key === "fileExplorer" && "Files"}
              {key === "settings" && "Settings"}
            </Button>
          ))}
        </div>
      </div>

      {/* Virtual cursor */}
      <div
        className="absolute w-6 h-6 pointer-events-none z-50"
        style={{
          left: cursorPosition.x - 3,
          top: cursorPosition.y - 3,
          transition: "transform 0.1s ease-out",
        }}
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-primary rounded-full opacity-20 animate-pulse"></div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            <path
              d="M5 3L19 12L12 13L9 20L5 3Z"
              fill="currentColor"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
