import { ControlData } from './controller'

export abstract class Packet {
  time: number = Date.now()
  abstract type: string
  abstract data: { [key: string]: any }

  static serialize(packet: Packet): string {
    return JSON.stringify(packet)
  }

  static deserialize(data: string): Packet | null {
    try {
      return JSON.parse(data) as Packet
    } catch (_) {
      return null
    }
  }
}

export class PingPacket extends Packet {
  type = 'ping'
  data = {}
}

export class ControlPacket extends Packet {
  type = 'control'

  constructor(public data: ControlData) {
    super()
  }
}
