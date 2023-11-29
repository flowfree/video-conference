'use client'

import { MicrophoneSlashIcon } from "@/app/components"

export default function Page() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="grow relative flex items-center justify-center">
        <div className="w-[100px] h-[100px] flex items-center justify-center rounded-full bg-gray-200 text-4xl font-bold">
          N
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
          <button className="w-[48px] h-[48px] rounded-full bg-gray-200 font-bold">
            A
          </button>
          <button className="w-[48px] h-[48px] rounded-full bg-gray-200 font-bold">
            B
          </button>
          <button className="w-[48px] h-[48px] rounded-full bg-gray-200 font-bold">
            C
          </button>
        </div>
        <div className="basis-1/3 flex flex-row gap-2 justify-end">
          <button className="w-[32px] h-[32px] rounded-full bg-gray-200 font-bold">
            D
          </button>
          <button className="w-[32px] h-[32px] rounded-full bg-gray-200 font-bold">
            E
          </button>
        </div>
      </div>
    </div>
  )
}
