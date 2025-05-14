"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Code, Copy, Check, Play, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Backend() {
  const [activeTab, setActiveTab] = useState("code")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const pythonCode = `import cv2
import mediapipe as mp
import pyautogui
import time

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(min_detection_confidence=0.8, min_tracking_confidence=0.8)
mp_drawing = mp.solutions.drawing_utils

# Screen Dimensions
screen_width, screen_height = pyautogui.size()

# Gesture Variables
last_action_time = 0  # Timer for gesture breaks
gesture_hold_time = 0.8  # Minimum time between gestures

# Helper Functions
def distance(landmark1, landmark2):
    """Calculate Euclidean distance between two landmarks."""
    return ((landmark1.x - landmark2.x)**2 + (landmark1.y - landmark2.y)**2)**0.5

def detect_gesture(hand_landmarks, hand_label, img):
    global last_action_time

    # Get relevant landmarks
    wrist = hand_landmarks.landmark[mp_hands.HandLandmark.WRIST]
    index_tip = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]
    middle_tip = hand_landmarks.landmark[mp_hands.HandLandmark.MIDDLE_FINGER_TIP]
    thumb_tip = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_TIP]
    pinky_tip = hand_landmarks.landmark[mp_hands.HandLandmark.PINKY_TIP]

    # Current time for gesture breaks
    current_time = time.time()
    action_text = "None"

    # Cursor Movement (Middle Finger)
    cursor_x = int(middle_tip.x * screen_width)
    cursor_y = int(middle_tip.y * screen_height)
    pyautogui.moveTo(cursor_x, cursor_y, duration=0.1)

    # Click Gesture (Index Finger Fully Folded)
    if distance(index_tip, thumb_tip) < 0.09:  # Index tip close to wrist
        if current_time - last_action_time > gesture_hold_time:
            action_text = "Click"
            pyautogui.click()
            last_action_time = current_time

    # Scroll Gesture (Thumb Up or Thumb Down)
    if thumb_tip.y < index_tip.y and thumb_tip.y < pinky_tip.y:  # Thumb up
        # Restrict this gesture to a more defined condition
        if abs(thumb_tip.x - index_tip.x) < 0.2:  # Thumb and index are vertically aligned
            if hand_label == "Right" and current_time - last_action_time > gesture_hold_time:
                action_text = "Scroll Up"
                pyautogui.scroll(60)
                last_action_time = current_time
    elif thumb_tip.y > index_tip.y and thumb_tip.y > pinky_tip.y:  # Thumb down
        # Restrict this gesture to a more defined condition
        if abs(thumb_tip.x - pinky_tip.x) < 0.2:  # Thumb and index are vertically aligned
            if hand_label == "Right" and current_time - last_action_time > gesture_hold_time:
                action_text = "Scroll Down"
                pyautogui.scroll(-60)
                last_action_time = current_time

    # Volume Up Gesture (V Shape with Index and Middle Finger)
    if distance(index_tip, middle_tip) > 0.15:  # Index and middle fingers forming a V
        if hand_label == "Right" and current_time - last_action_time > gesture_hold_time:
            action_text = "Volume Up"
            pyautogui.press("volumeup")
            last_action_time = current_time

    # Volume Down Gesture (Index and Middle Finger Folded)
    if (
        distance(index_tip, middle_tip) < 0.05  # Index and middle tips close together (folded)
    ):
        if hand_label == "Right" and current_time - last_action_time > gesture_hold_time:
            action_text = "Volume Down"
            pyautogui.press("volumedown")
            last_action_time = current_time

    # Zoom Gesture
    if distance(thumb_tip, pinky_tip) < 0.09:  # Thumb and pinky close
        if hand_label == "Right" and current_time - last_action_time > gesture_hold_time:
            action_text = "Zoom In"
            pyautogui.hotkey("ctrl", "+")
            last_action_time = current_time

    # Zoom Gesture
    if distance(thumb_tip, middle_tip)< 0.09:  # Thumb and pinky FAR
        if hand_label == "Right" and current_time - last_action_time > gesture_hold_time:
            action_text = "Zoom OUT"
            pyautogui.hotkey("ctrl", "-")
            last_action_time = current_time
        
    # Slide Control (Swipe Gestures)
    if distance(thumb_tip, pinky_tip) > 2:  # Wide hand motion
        if hand_label == "Right" and current_time - last_action_time > gesture_hold_time:
            action_text = "Next Slide"
            pyautogui.press("right")
            last_action_time = current_time
        elif hand_label == "Left" and current_time - last_action_time > gesture_hold_time:
            action_text = "Previous Slide"
            pyautogui.press("left")
            last_action_time = current_time

    # Display Action
    cv2.putText(img, f"Action: {action_text}", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

# Main Program Loop
cap = cv2.VideoCapture(0)

while True:
    success, frame = cap.read()
    if not success:
        break

    # Flip and Convert Frame
    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Process with MediaPipe Hands
    results = hands.process(rgb_frame)

    if results.multi_hand_landmarks:
        for idx, hand_landmarks in enumerate(results.multi_hand_landmarks):
            hand_label = "Right" if idx == 0 else "Left"  # Assume single hand as right
            mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            detect_gesture(hand_landmarks, hand_label, frame)

    # Show Output
    cv2.imshow("Hand Gesture Recognition", frame)

    # Exit on 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release Resources
cap.release()
cv2.destroyAllWindows()`

  const tabs = [
    { id: "code", label: "Python Code", icon: Code },
    { id: "install", label: "Installation", icon: Terminal },
    { id: "run", label: "How to Run", icon: Play },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "code":
        return (
          <div className="relative">
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-300 max-h-[500px] overflow-y-auto">
              <code>{pythonCode}</code>
            </pre>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={handleCopy}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </Button>
          </div>
        )
      case "install":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Installation Requirements</h3>
            <p className="text-gray-300">
              To run the GestureGuy backend, you'll need to install the following Python packages:
            </p>
            <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
              <code className="text-gray-300">pip install opencv-python mediapipe pyautogui</code>
            </div>
            <h4 className="text-lg font-semibold mt-6">System Requirements</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Python 3.7 or higher</li>
              <li>Webcam or camera device</li>
              <li>Windows, macOS, or Linux operating system</li>
              <li>At least 4GB RAM recommended</li>
            </ul>
          </div>
        )
      case "run":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Running GestureGuy</h3>
            <p className="text-gray-300">Follow these steps to run the GestureGuy gesture recognition system:</p>
            <ol className="list-decimal list-inside text-gray-300 space-y-3">
              <li>
                Save the Python code to a file named <code className="bg-gray-800 px-1 rounded">gesture_guy.py</code>
              </li>
              <li>Open a terminal or command prompt</li>
              <li>Navigate to the directory containing the file</li>
              <li>
                Run the script with: <code className="bg-gray-800 px-1 rounded">python gesture_guy.py</code>
              </li>
              <li>A window will open showing your webcam feed with hand landmarks</li>
              <li>Use your hand gestures to control your computer</li>
              <li>Press 'q' to quit the application</li>
            </ol>
            <div className="bg-blue-900/30 border border-blue-700/30 rounded-lg p-4 mt-4">
              <h4 className="text-lg font-semibold text-blue-400">Tip</h4>
              <p className="text-gray-300">
                Make sure you have good lighting and keep your hand within the camera frame for best results.
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <section id="backend" className="py-20 relative overflow-hidden">
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
            The <span className="text-primary">Backend</span> Magic
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Powered by computer vision and machine learning, our Python backend translates hand movements into digital
            commands.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-xl overflow-hidden glassmorphism border border-gray-800 p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  className={`${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "border-gray-700 text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </Button>
              ))}
            </div>

            <div className="mt-4">{renderTabContent()}</div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h4 className="font-medium text-primary mb-2">Hand Detection</h4>
                <p className="text-sm text-gray-300">
                  Uses MediaPipe to detect and track hand landmarks in real-time video feed.
                </p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h4 className="font-medium text-primary mb-2">Gesture Recognition</h4>
                <p className="text-sm text-gray-300">
                  Analyzes the spatial relationships between hand landmarks to identify specific gestures.
                </p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h4 className="font-medium text-primary mb-2">Computer Control</h4>
                <p className="text-sm text-gray-300">
                  Translates recognized gestures into system commands using PyAutoGUI.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
