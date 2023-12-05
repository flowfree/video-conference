'use client'

import { useState, useEffect, useRef } from 'react'
import { type Participant } from '@/app/lib/types'

export function UserStreams({
  userId,
  participants,
  onToggleCamera
}: {
  userId: string
  participants: {[userId: string]: Participant},
  onToggleCamera?: () => void
}) {
  const [numCols, setNumCols] = useState(1)
  const [videoHeight, setVideoHeight] = useState(0)
  const [windowResized, setWindowResized] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const participantArray: Participant[] = []
  for (const key in participants) {
    participantArray.push(participants[key])
  }

  // On page load,
  // Set the evant handler to flag if window resized
  useEffect(() => {
    function handleResize() {
      setWindowResized(true)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // When the guest list arrived or window has been resized,
  // Calculate and setup the layout
  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    let height = containerRef.current!.clientHeight
    const numUsers = participantArray.length

    if (numUsers === 1) {
      setVideoHeight(height -= 48)
      setNumCols(1)
    } else if (numUsers <= 2) {
      setVideoHeight(height - (height / 3))
      setNumCols(numUsers)
    } else if (numUsers === 3) {
      setVideoHeight(height / 2)
      setNumCols(3)
    } else if (numUsers === 4) {
      setVideoHeight((height - 48) / 2)
      setNumCols(2)
    } else {
      setVideoHeight((height - 48) / 2)
      setNumCols(3)
    }

    setWindowResized(false)
  }, [participantArray, windowResized])

  return (
    <div ref={containerRef} className="grow flex flex-row gap-4">
      <div className="grow flex items-center justify-center">
        <div className={`grow grid grid-cols-${numCols} gap-4 ` + (numCols === 1 ? 'max-w-[900px]' : '')}>
          {participantArray.map(participant => (
            <div 
              key={participant.userId} 
              className="relative bg-gray-100 flex items-center justify-center" 
              style={{height: `${videoHeight}px`}}
            >
              {participant.videoEnabled ? (
                <video 
                  ref={(video) => {
                    if (video) video.srcObject = participant.stream || null
                  }}
                  className="w-full h-full scale-x-[-1] object-cover"
                  autoPlay
                  muted
                />
              ) : (
                <div className="w-full h-full object-cover flex items-center justify-center bg-gray-100">
                  <img src={`https://i.pravatar.cc/150`} className="w-24 h-24 rounded-full" alt="" />
                </div>
              )}
              <span className="absolute bottom-2 left-2 px-2 rounded-full bg-gray-800/50 text-white font-bold">
                {participant.username}
              </span>
              {participant.userId == `${userId}` && (
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <button 
                    className="px-2 bg-indigo-600 text-white text-sm"
                    onClick={() => onToggleCamera && onToggleCamera()}
                  >
                    Cam
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
