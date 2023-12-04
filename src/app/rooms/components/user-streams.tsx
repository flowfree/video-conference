'use client'

import { useState, useEffect, useRef } from 'react'
import { type UserStream } from '@/app/lib/types'

export function UserStreams({
  userId,
  numUsers,
  userStreams
}: {
  userId: string
  numUsers: number
  userStreams: UserStream[]
}) {
  const [numCols, setNumCols] = useState(1)
  const [videoHeight, setVideoHeight] = useState(0)
  const [windowResized, setWindowResized] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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
  }, [numUsers, windowResized])

  return (
    <div ref={containerRef} className="grow flex flex-row gap-4">
      <div className="grow flex items-center justify-center">
        <div className={`grow grid grid-cols-${numCols} gap-4 ` + (numCols === 1 ? 'max-w-[900px]' : '')}>
          {userStreams.map(userStream => (
            <div 
              key={userStream.userId} 
              className="relative bg-gray-100 flex items-center justify-center" 
              style={{height: `${videoHeight}px`}}
            >
              <video 
                ref={(video) => {
                  if (video) video.srcObject = userStream.stream || null
                }}
                className="w-full h-full scale-x-[-1] object-cover"
                autoPlay
                muted
              />
              <span className="absolute bottom-2 left-2 px-2 rounded-full bg-gray-800/50 text-white font-bold">
                {userStream.username}
              </span>
              {userStream.userId == `${userId}` && (
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <button className="px-2 bg-indigo-600 text-white text-sm">
                    Mic
                  </button>
                  <button className="px-2 bg-indigo-600 text-white text-sm">
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
