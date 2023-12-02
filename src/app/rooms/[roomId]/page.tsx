'use client'

import { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import { Peer } from 'peerjs'
import { StreamControls } from '@/app/components'

export default function Page({
  params: { roomId }
}: {
  params: { roomId: string }
}) {
  const [userStream, setUserStream] = useState<MediaStream|null>(null)
  const [peer, setPeer] = useState<Peer>()
  const [videoStreams, setVideoStreams] = useState<MediaStream[]>([])
  const [username, setUsername] = useState('')
  const [userId, setUserId] = useState(0)

  const [numCols, setNumCols] = useState(1)
  const [videoHeight, setVideoHeight] = useState(0)
  const [windowResized, setWindowResized] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate random username and ID and handle window resizes 
  useEffect(() => {
    let chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let username = ''
    let userId = 0
    for (let i = 0; i < 5; i++) {
        const index = Math.floor(Math.random() * chars.length);
        username += chars[index]
        userId += index
    }
    setUsername(username)
    setUserId(userId)

    function handleResize() {
      setWindowResized(true)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Setup the WebRTC and connect to the signaling server on start
  useEffect(() => {
    async function initApp() {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })

      // const socket = io('http://localhost:3001')
      const peer = new Peer()

      peer
        .on('open', peerId => {
        })
        .on('call', call => { 
          call.answer(userStream)
        })
        .on('error', err => {
          console.error(`hello ${err}`)
        })

      // socket
      //   .on('guest-list', () => {
      //   })
      //   .on('leave-room', peerId => {
      //   })

      setUserStream(userStream)
      setVideoStreams(s => [...s, userStream])
      setPeer(peer)
    }

    initApp()

    return () => {
      userStream?.getTracks().forEach(track => track.stop())
      if (peer) {
        peer.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    let height = containerRef.current!.clientHeight
    let count = videoStreams.length

    if (count === 1) {
      setVideoHeight(height -= 48)
      setNumCols(1)
    } else if (count <= 2) {
      setVideoHeight(height - (height / 3))
      setNumCols(count)
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

    setWindowResized(false)
  }, [videoStreams, containerRef, windowResized])

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
                  ref={(video) => {
                    if (video) video.srcObject = stream || null
                  }}
                  className="w-full h-full scale-x-[-1] object-cover"
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

