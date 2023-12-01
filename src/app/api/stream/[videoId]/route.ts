import fs from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import mime from 'mime'

function streamFile(path: string, options?: any): ReadableStream<Uint8Array> {
  const stream = fs.createReadStream(path, options)

  return new ReadableStream({
    start(controller) {
      stream.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)))
      stream.on('end', () => controller.close())
      stream.on('error', (error: NodeJS.ErrnoException) => controller.error(error))
    },
    cancel() {
      stream.destroy()
    },
  })
}

export async function GET(
  req: NextRequest,
  { params }: { params: { videoId: string } }
): Promise<NextResponse> {
  const filePath = path.resolve(`./public/videos/${params.videoId}.mp4`)
  const stat = fs.statSync(filePath)
  const fileSize = stat.size
  const range = req.headers.get('range')

  let streamOptions = {}
  const headers = new Headers()
  headers.set('Content-Type', 'video/mp4')
  headers.set('Content-Length', `${fileSize}`)

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1

    if(start >= fileSize) {
      return NextResponse.json({ 
        success: false,
        message: `Requested range not satisfiable\n${start} >= ${fileSize}`
      }, { 
        status: 416 
      })
    }

    streamOptions = { start, end }
    headers.set('Content-Range', `bytes ${start}-${end}/${fileSize}`)
    headers.set('Accept-Ranges', 'bytes')
    headers.set('Content-Length', `${end - start + 1}`)
  }

  const stream = streamFile(filePath, streamOptions)
  return new NextResponse(stream, { status: 200, headers })
}

function getContentType(filePath: string) {
  const contentType = mime.getType(filePath)
  return contentType || 'application/octet-stream'
}
