"use client"

import { useEffect, useState, useRef } from "react"
import Home from "./Home.jsx"

const HomeWithIntro = () => {
  const [showVideo, setShowVideo] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    const hasWatched = localStorage.getItem("introPlayed")
    if (!hasWatched) {
      setShowVideo(true)
    }
  }, [])

  const handleVideoEnd = () => {
    localStorage.setItem("introPlayed", "true")
    setShowVideo(false)
  }

  return (
    <div className="relative">
      {/* Show video overlay if first visit */}
      {showVideo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            src="/MyResuMate-intro.mp4"
            className="w-full h-full object-cover"
            autoPlay
            muted={isMuted}
            onEnded={handleVideoEnd}
          />

          {/* Sound toggle button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-6 right-6 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black/80 transition"
          >
            {isMuted ? "🔇 Sound Off" : "🔊 Sound On"}
          </button>
        </div>
      )}

      {/* Show actual Home page once video finishes */}
      <div className={showVideo ? "hidden" : "block"}>
        <Home />
      </div>
    </div>
  )
}

export default HomeWithIntro
