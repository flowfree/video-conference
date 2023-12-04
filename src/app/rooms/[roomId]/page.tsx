'use client'

import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import { Peer } from 'peerjs'
import { StreamControls } from '@/app/components'
import { UserStreams } from '../components'
import { type User, type UserStream } from '@/app/lib/types'

export default function Page({
  params: { roomId }
}: {
  params: { roomId: string }
}) {
  const [users, setUsers] = useState<User[]>([])
  const [userStreams, setUserStreams] = useState<UserStream[]>([])
  const [myStream, setMyStream] = useState<MediaStream|null>(null)
  const [username, setUsername] = useState('')
  const [userId, setUserId] = useState('')
  const [leavingUser, setLeavingUser] = useState<User|null>(null)
  const [peer, setPeer] = useState<Peer>()

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
    setUserId(`${userId}`)
  }, [])

  // After user ID and username are set,
  // Setup the WebRTC and connect to the signaling server on start
  useEffect(() => {
    if (!userId || !username) return 

    async function initMyStream() {
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

      setMyStream(userStream)
      setPeer(peer)
    }

    initMyStream()

    return () => {
      myStream?.getTracks().forEach(track => track.stop())
      userStreams?.forEach(userStream => {
        userStream.stream?.getTracks().forEach(track => track.stop())
      })
      if (peer) {
        peer.disconnect()
      }
    }
  }, [userId, username])

  // When the guest list arrived,
  // Make the connections to view their video streams
  useEffect(() => {
    if (!peer || !myStream || users.length === 0) return

    users.forEach(user => {
      const { userId, username, peerId } = user

      if (peerId === peer.id) {
        setUserStreams(p => [
          ...p.filter(x => x.peerId !== peerId), 
          { userId, username, peerId, stream: myStream }
        ])
      } else {
        const call = peer.call(peerId, myStream)
        call.on('stream', stream => {
          setUserStreams(p => [
            ...p.filter(x => x.peerId !== peerId), 
            { userId, username, peerId, stream }
          ])
        })
      }
    })
  }, [users])

  // When a user is leaving,
  // Remove the video streams from page
  useEffect(() => {
    if (!leavingUser) return

    const idx = userStreams.findIndex(x => x.peerId === leavingUser.peerId)
    if (idx >= 0) {
      userStreams[idx].stream?.getTracks().forEach(track => track.stop())
      setUserStreams(s => s.filter(x => x.peerId !== leavingUser.peerId))
      setUsers(u => u.filter(x => x.userId !== leavingUser.userId))
    }
  }, [leavingUser])

  return (
    <div className="p-4 w-full h-full flex flex-col">
      <UserStreams userId={userId} numUsers={users.length} userStreams={userStreams} />
      <StreamControls />
    </div>
  )
}

