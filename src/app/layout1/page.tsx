'use client'

import { useState } from 'react'
import { 
  MicrophoneIcon, 
  VideoCameraIcon, 
  VideoCameraSlashIcon,
  PhoneIcon 
} from "@heroicons/react/24/solid"
import { MicrophoneSlashIcon } from "@/app/components"

export default function Page() {
  const [showVideo, setShowVideo] = useState(true)

  return (
    <div className="w-full h-full flex flex-col">
      <div className="grow relative flex items-center justify-center">
        <div className="max-w-[80%] max-h-[90%] overflow-hidden">
          {showVideo ? (
            <img src="/img/bg-1.jpg" className="max-w-[90%] rounded-md mx-auto bg-cover" alt="" />
          ) : (
            <div className="w-[100px] h-[100px] flex items-center justify-center rounded-full bg-gray-200 text-4xl font-bold">
              N
            </div>
          )}
        </div>
        <div className="absolute top-8 right-8">
          <MicrophoneSlashIcon />
        </div>
        <div className="absolute bottom-8 left-8">
          Nash A
        </div>
      </div>

      <div className="p-4 flex flex-row gap-4 items-center">
        <div className="basis-1/3">
          7:20 AM | abc-def-ghi
        </div>
        <div className="basis-1/3 flex flex-row gap-2 justify-center">
          <button className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 font-bold">
            <MicrophoneIcon className="w-5 h-5" />
          </button>
          <button 
            className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 font-bold"
            onClick={() => setShowVideo(!showVideo)}
          >
            {showVideo ? (
              <VideoCameraIcon className="w-5 h-5" />
            ) : (
              <VideoCameraSlashIcon className="w-5 h-5" />
            )}
          </button>
          <button className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 font-bold">
            <PhoneIcon className="w-8 h-6 rotate-[135deg]" />
          </button>
        </div>
        <div className="basis-1/3 flex flex-row gap-2 justify-end">
          <button className="w-[32px] h-[32px] rounded-full bg-gray-200 hover:bg-gray-300">
            D
          </button>
          <button className="w-[32px] h-[32px] rounded-full bg-gray-200 hover:bg-gray-300">
            E
          </button>
        </div>
      </div>
    </div>
  )
}
