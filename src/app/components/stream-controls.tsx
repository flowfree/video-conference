'use client'

import { 
  MicrophoneIcon,
  VideoCameraIcon,
  HandRaisedIcon,
  PhoneIcon,
} from '@heroicons/react/24/solid'

import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline'

export function StreamControls() {
  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="basis-1/3">
        7:20 AM | abc-def-ghi
      </div>
      <div className="basis-1/3 flex flex-row gap-2 justify-center">
        <button className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 font-bold">
          <MicrophoneIcon className="w-5 h-5" />
        </button>
        <button className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 font-bold">
          <VideoCameraIcon className="w-5 h-5" />
        </button>
        <button className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 font-bold">
          <HandRaisedIcon className="w-5 h-5" />
        </button>
        <button className="w-[48px] h-[48px] flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 font-bold">
          <PhoneIcon className="w-8 h-6 rotate-[135deg]" />
        </button>
      </div>
      <div className="basis-1/3 flex flex-row gap-2 justify-end">
        <button className="hover:text-indigo-500">
          <ChatBubbleLeftEllipsisIcon className="w-8 h-6" />
        </button>
      </div>
    </div>
  )
}