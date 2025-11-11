import { Controller, Post, Body } from '@nestjs/common'
import { AgoraService } from './agora.service'

@Controller('agora')
export class AgoraController {
  constructor(private readonly agoraService: AgoraService) {}

  @Post('token')
  getAgoraToken(@Body() body: {
    channelName: string
    uid: string
    role?: 'host' | 'audience'
    startTime?: number
    duration?: number
  }) {
    const { channelName, uid, role = 'audience', startTime, duration } = body

    if (!channelName || !uid) {
      return { error: 'channelName and uid are required' }
    }

    const tokenData = this.agoraService.generateToken(channelName, uid, role, startTime, duration)

    if (!tokenData.token) {
      return { error: tokenData.error }
    }

    return { success: true, data: tokenData }
  }

  @Post('end')
  endStream(@Body() body: { channelName: string; uid: string }) {
    const { channelName, uid } = body
    if (!channelName || !uid) {
      return { error: 'channelName and uid are required' }
    }
    this.agoraService.endStream(channelName, uid)
    return { success: true, message: 'Stream ended' }
  }
}
