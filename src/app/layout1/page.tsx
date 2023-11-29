'use client'

import { useState } from 'react'
import { StreamControls } from '@/app/components'

export default function Page() {
  const [showVideo, setShowVideo] = useState(true)

  return (
    <div className="p-4 w-full h-full flex flex-col">

      <div className="grow flex items-center justify-center">
        <div className="grow grid grid-cols-1 gap-4 max-w-[900px]">
          <div className="h-[550px] bg-gray-100 flex items-center justify-center">
            <img src="/img/bg-1.jpg" className="h-full w-full object-cover" alt="" />
          </div>
        </div>
      </div>

      <StreamControls />
    </div>
  )
}
