'use client'

import { useState, useEffect, useRef } from 'react'
import { StreamControls } from '@/app/components'

export default function Page() {
  const [numCols, setNumCols] = useState(1)
  const [videoHeight, setVideoHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const videoStreams: string[] = [
    // '/api/stream/1',
    // '/api/stream/2',
    // '/api/stream/3',
    // '/api/stream/4',
    // '/api/stream/5',
  ]

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    let height = containerRef.current!.clientHeight
    let count = videoStreams.length

    if (count === 1) {
      setVideoHeight(height -= 48)
      setNumCols(1)
    } else if (count === 2) {
      setVideoHeight(height - (height / 3))
      setNumCols(2)
    } else if (count === 3) {
      setVideoHeight(height / 2)
      setNumCols(3)
    } else if (count === 4) {
      setVideoHeight((height - 48) / 2)
      setNumCols(2)
    } else {
      setVideoHeight((height - 48) / 2)
      setNumCols(3)
    }
  }, [videoStreams, containerRef])

  return (
    <div className="p-4 w-full h-full flex flex-col">

      <div ref={containerRef} className="grow flex flex-row gap-4">
        <div className="grow flex items-center justify-center">
          <div className={`grow grid grid-cols-${numCols} gap-4 ` + (numCols === 1 ? 'max-w-[900px]' : '')}>
            {videoStreams.map((stream, idx) => (
              <div 
                key={idx} 
                className="bg-gray-100 flex items-center justify-center" 
                style={{height: `${videoHeight}px`}}
              >
                <video 
                  src={stream}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <StreamControls />
      </div>
    </div>
  )
}

