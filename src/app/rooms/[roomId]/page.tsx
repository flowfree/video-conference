'use client'

import { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import { Peer } from 'peerjs'
import { StreamControls } from '@/app/components'

interface User {
  peerId: string
  userId: string
  username: string
}

interface VideoStream extends User {
  stream?: MediaStream
}

export default function Page({
  params: { roomId }
}: {
  params: { roomId: string }
}) {
  const [users, setUsers] = useState<User[]>([])
  const [videoStreams, setVideoStreams] = useState<VideoStream[]>([])
  const [userStream, setUserStream] = useState<MediaStream|null>(null)
  const [username, setUsername] = useState('')
  const [userId, setUserId] = useState(0)
  const [leavingUser, setLeavingUser] = useState<User|null>(null)

  const [peer, setPeer] = useState<Peer>()
  const [numCols, setNumCols] = useState(1)
  const [videoHeight, setVideoHeight] = useState(0)
  const [windowResized, setWindowResized] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // On page load,
  // Generate random username and ID and handle window resizes 
  useEffect(() => {
    let chars = 'abcdefghijklmnopqrstuvwxyz'
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

  // After user ID and username are set,
  // Setup the WebRTC and connect to the signaling server on start
  useEffect(() => {
    if (!userId || !username) return 

    async function initApp() {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })

      const socket = io('http://localhost:3001')
      const peer = new Peer()

      peer
        .on('open', peerId => {
          socket.emit('join-room', { roomId, peerId, userId, username })
        })
        .on('call', call => { 
          call.answer(userStream)
        })
        .on('error', err => {
          console.error(err)
        })

      socket
        .on('guest-list', (guests: User[]) => {
          setUsers(guests)
        })
        .on('leave-room', (user: User) => {
          setLeavingUser(user)
        })

      setUserStream(userStream)
      setPeer(peer)
    }

    initApp()

    return () => {
      userStream?.getTracks().forEach(track => track.stop())
      if (peer) {
        peer.disconnect()
      }
    }
  }, [userId, username])

  // When the guest list arrived,
  // Make the connections to view their video streams
  useEffect(() => {
    if (!peer || !userStream || users.length === 0) return

    users.forEach(user => {
      const { userId, username, peerId } = user

      if (peerId === peer.id) {
        setVideoStreams(p => [
          ...p.filter(x => x.peerId !== peerId), 
          { userId, username, peerId, stream: userStream }
        ])
      } else {
        const call = peer.call(peerId, userStream)
        call.on('stream', stream => {
          setVideoStreams(p => [
            ...p.filter(x => x.peerId !== peerId), 
            { userId, username, peerId, stream }
          ])
        })
      }
    })
  }, [users])

  // When the guest list arrived or window has been resized,
  // Calculate and setup the layout
  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    let height = containerRef.current!.clientHeight
    let count = users.length

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
  }, [users, windowResized])

  // When a user is leaving,
  // Remove the video streams from page
  useEffect(() => {
    if (!leavingUser) return

    const idx = videoStreams.findIndex(x => x.peerId === leavingUser.peerId)
    if (idx >= 0) {
      videoStreams[idx].stream?.getTracks().forEach(track => track.stop())
      setVideoStreams(s => s.filter(x => x.peerId !== leavingUser.peerId))
      setUsers(u => u.filter(x => x.userId !== leavingUser.userId))
    }
  }, [leavingUser])

  return (
    <div className="p-4 w-full h-full flex flex-col">

      <div ref={containerRef} className="grow flex flex-row gap-4">
        <div className="grow flex items-center justify-center">
          <div className={`grow grid grid-cols-${numCols} gap-4 ` + (numCols === 1 ? 'max-w-[900px]' : '')}>
            {videoStreams.map(videoStream => (
              <div 
                key={videoStream.userId} 
                className="relative bg-gray-100 flex items-center justify-center" 
                style={{height: `${videoHeight}px`}}
              >
                <video 
                  ref={(video) => {
                    if (video) video.srcObject = videoStream.stream || null
                  }}
                  className="w-full h-full scale-x-[-1] object-cover"
                  autoPlay
                  muted
                />
                <span className="absolute bottom-2 left-2 px-4 rounded-full bg-gray-800/50 text-white font-bold">
                  {videoStream.username}
                </span>
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

