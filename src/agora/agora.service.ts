import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { RtcRole, RtcTokenBuilder } from 'agora-access-token'

interface ActiveStream {
  startTime: number
  duration: number
  timeout?: NodeJS.Timeout
}

@Injectable()
export class AgoraService {
  private activeStreams: Record<string, ActiveStream> = {}

  generateToken(
    channelName: string,
    uid: string | number,
    role: 'host' | 'audience' = 'audience',
    startTime?: number,
    duration?: number
  ) {
    const appID = process.env.AGORA_APP_ID
    const appCertificate = process.env.AGORA_APP_CERTIFICATE

    if (!appID || !appCertificate) {
      throw new InternalServerErrorException('Agora App ID or Certificate not set')
    }

    const agoraRole = role === 'host' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER
    const now = Math.floor(Date.now() / 1000)
    let expireTs = now + 36000
    const key = `${channelName}_host`

    if (role === 'host') {
      if (!startTime) startTime = now
      if (!duration) duration = 36000

      expireTs = startTime + duration

      if (this.activeStreams[key]?.timeout) clearTimeout(this.activeStreams[key].timeout)
      const timeout = setTimeout(() => {
        this.endStream(channelName, uid)
      }, duration * 1000)

      this.activeStreams[key] = { startTime, duration, timeout }
    }

 if (role === 'audience') {
  const stream = this.activeStreams[key]
  if (!stream) {
    return { error: 'Stream has not been scheduled yet' }
  }

  // Block audience if current time is before host's startTime
  if (now < stream.startTime) {
    return { error: 'Stream has not started yet. Please wait until host starts.' }
  }

  // Token valid until end of host's stream
  expireTs = stream.startTime + stream.duration

  // If current time is past end of stream, block audience
  if (now > expireTs) {
    return { error: 'Stream has ended.' }
  }
}


    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      Number(uid),
      agoraRole,
      expireTs
    )

    return {
      token,
      channelName,
      uid,
      role,
      startTime: role === 'host' ? startTime : this.activeStreams[key]?.startTime,
      duration: role === 'host' ? duration : this.activeStreams[key]?.duration,
      expiresIn: expireTs - now
    }
  }

  endStream(channelName: string, uid: string | number) {
    const key = `${channelName}_host`
    if (this.activeStreams[key]?.timeout) clearTimeout(this.activeStreams[key].timeout)
    delete this.activeStreams[key]
    console.log(`Stream ended for channel ${channelName}`)
  }
}
