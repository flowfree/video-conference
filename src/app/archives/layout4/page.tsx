'use client'

import { useState, useEffect, useRef } from 'react'
import { StreamControls } from '../../components'

export default function Page() {
  const [videoHeight, setVideoHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const height = containerRef.current.clientHeight
      setVideoHeight((height - 48) / 2)
    }
  }, [containerRef])

  return (
    <div className="p-4 w-full h-full flex flex-col">
      
      <div ref={containerRef} className="grow flex flex-row gap-4">
        <div className="grow flex items-center justify-center">
          <div className="grow grid grid-cols-2 gap-4">
            <div className="bg-gray-100 flex items-center justify-center" style={{height: `${videoHeight}px`}}>
              <img src="/img/bg-1.jpg" className="h-full w-full object-cover" alt="" />
            </div>
            <div className="bg-gray-100 flex items-center justify-center" style={{height: `${videoHeight}px`}}>
              <img src="/img/bg-2.jpg" className="h-full w-full object-cover" alt="" />
            </div>
            <div className="bg-gray-100 flex items-center justify-center" style={{height: `${videoHeight}px`}}>
              <img src="/img/bg-3.jpg" className="h-full w-full object-cover" alt="" />
            </div>
            <div className="bg-gray-100 flex items-center justify-center" style={{height: `${videoHeight}px`}}>
              <img src="/img/bg-4.jpg" className="h-full w-full object-cover" alt="" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <StreamControls />
      </div>
    </div>
  )
}
