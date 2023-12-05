export interface Participant {
  userId: string
  username: string
  videoEnabled: boolean
  peerId: string
  stream: MediaStream | null
}
