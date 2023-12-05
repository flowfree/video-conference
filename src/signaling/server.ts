import express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import { type Participant } from '@/app/lib/types'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

const SOCKET_SERVER_PORT = process.env.SOCKET_SERVER_PORT || 3001

interface Rooms {
  [roomId: string]: {[userId: string]: Participant}
}

let rooms: Rooms = {}

io.on('connection', (socket) => {
  socket.on('join-room', ({ roomId, peerId, userId, username }) => {
    const participant: Participant = { 
      peerId, 
      userId, 
      username,
      videoEnabled: true,
      stream: null
    }
    if (!rooms.hasOwnProperty(roomId)) {
      rooms[roomId] = {}
    }
    rooms[roomId][userId] = participant

    socket.join(roomId)
    io.to(roomId).emit('guest-list', rooms[roomId])

    socket.on('turned-off-camera', (userId) => {
    })

    socket.on('disconnect', () => {
      if (userId in rooms[roomId]) {
        delete rooms[roomId][userId]
        socket.to(roomId).emit('leave-room', userId)
      }
    })
  })
})

httpServer.listen(SOCKET_SERVER_PORT, () => {
  console.log(`Socket.io server listening on *:${SOCKET_SERVER_PORT}`)
})
