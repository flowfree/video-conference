import express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

const SOCKET_SERVER_PORT = process.env.SOCKET_SERVER_PORT || 3001

interface Rooms {
  [roomId: string]: {
    peerId: string,
    userId: string,
    username: string
  }[]
}

let rooms: Rooms = {}

io.on('connection', (socket) => {
  socket.on('join-room', ({ roomId, peerId, userId, username }) => {
    if (roomId in rooms) {
      rooms[roomId] = [...rooms[roomId], { peerId, userId, username }]
    } else {
      rooms[roomId] = [{ peerId, userId, username }]
    }

    socket.join(roomId)
    io.to(roomId).emit('guest-list', rooms[roomId])

    socket.on('disconnect', () => {
      const participants = rooms[roomId]
      const idx = participants.findIndex(x => x.peerId === peerId)

      if (idx !== -1) {
        rooms[roomId] = rooms[roomId].filter(x => x.peerId !== peerId)
        socket.to(roomId).emit('leave-room', participants[idx])
      }
    })
  })
})

httpServer.listen(SOCKET_SERVER_PORT, () => {
  console.log(`Socket.io server listening on *:${SOCKET_SERVER_PORT}`)
})
