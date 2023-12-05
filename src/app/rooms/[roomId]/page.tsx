'use client'

import { useState, useEffect } from 'react'
import io, { Socket } from 'socket.io-client'
import { Peer } from 'peerjs'
import { UserStreams, StreamControls } from '../components'
import { type Participant } from '@/app/lib/types'

export default function Page({
  params: { roomId }
}: {
  params: { roomId: string }
}) {
  const [participants, setParticipants] = useState<{[userId: string]: Participant}>({})
  const [myStream, setMyStream] = useState<MediaStream|null>(null)
  const [username, setUsername] = useState('')
  const [userId, setUserId] = useState('')

  const [socket, setSocket] = useState<Socket>()
  const [peer, setPeer] = useState<Peer>()

  // On page load,
  // 1. Generate random username and ID and handle window resizes 
  // 2. Init user's camera
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
    setUserId(`${userId}`)

    async function initCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      setMyStream(stream)
    }

    initCamera()
  }, [])

  // After user ID and username are set,
  // Setup PeerJS and connect to the signaling server 
  useEffect(() => {
    if (!userId || !username) return 

    const socket = io('http://localhost:3001')
    const peer = new Peer()

    peer
      .on('open', peerId => {
        socket.emit('join-room', { roomId, peerId, userId, username })
      })
      .on('call', call => { 
        if (myStream) {
          call.answer(myStream)
        }
      })
      .on('error', err => {
        console.error(err)
      })

    socket.on('guest-list', (guests: {[userId: string]: Participant}) => {
      for (const key in guests) {
        const guest = guests[key]
        if (guest.userId === userId) {
          setParticipants(prevState => {
            const newState = {...prevState}
            newState[userId] = {...guest, stream: myStream}
            return newState
          })
        } else {
          if (myStream && peer) {
            const call = peer.call(guest.peerId, myStream)
            call.on('stream', stream => {
              setParticipants(prevState => {
                const newState = {...prevState}
                newState[guest.userId] = {...guest, stream }
                return newState
              })
            })
          }
        }
      }
    })

    socket.on('leave-room', (userId: string) => {
      setParticipants(prevState => {
        const newState = {...prevState}
        delete newState[userId]
        return newState
      })
    })

    setPeer(peer)
    setSocket(socket)

    return () => {
      myStream?.getTracks().forEach(track => track.stop())
      for (const userId in participants) {
        participants[userId].stream?.getTracks().forEach(track => track.stop())
      }
      if (peer) {
        peer.disconnect()
      }
    }
  }, [userId, username, myStream])

  async function handleToggleCamera() {
    if (myStream) {
      myStream.getTracks().forEach(track => track.stop())
      setMyStream(null)
    } else {
    }
  }

  return (
    <div className="p-4 w-full h-full flex flex-col">
      <UserStreams 
        userId={userId} 
        participants={participants} 
        onToggleCamera={handleToggleCamera}
      />

      <StreamControls />
    </div>
  )
}

