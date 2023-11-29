'use client'

import { useState } from 'react'
import { 
  MicrophoneIcon, 
  VideoCameraIcon, 
  VideoCameraSlashIcon,
  HandRaisedIcon,
  PhoneIcon 
} from "@heroicons/react/24/solid"
import { MicrophoneSlashIcon } from "@/app/components"

export default function Page() {
  const [showVideo, setShowVideo] = useState(true)

  return (
    <div className="p-4 w-full h-full flex flex-col">
      <div className="grow flex items-center justify-center">
        <div className="max-w-[900px] max-h-[550px] flex items-center justify-center overflow-hidden">
          {showVideo ? (
            <img src="/img/bg-1.jpg" className="h-full w-auto object-cover" alt="" />
          ) : (
            <div className="w-[100px] h-[100px] flex items-center justify-center rounded-full bg-gray-200 text-4xl font-bold">
              N
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 flex flex-row gap-4 items-center">
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
           <HandRaisedIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="basis-1/3 flex flex-row gap-2 justify-end">
          <button className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 font-bold">
            <PhoneIcon className="w-8 h-6 rotate-[135deg]" />
          </button>
        </div>
      </div>
    </div>
  )
}
