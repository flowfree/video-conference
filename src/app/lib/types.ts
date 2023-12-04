export interface User {
  peerId: string
  userId: string
  username: string
}

export interface UserStream extends User {
  stream: MediaStream | null
}
