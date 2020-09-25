export abstract class Packet {
  time: number = Date.now()
  abstract type: string
  abstract data: { [key: string]: any }

  static serialize(packet: Packet): string {
    return JSON.stringify(packet)
  }

  static deserialize(data: string): Packet {
    return JSON.parse(data) as Packet
  }
}

export class PingPacket extends Packet {
  type = "ping"
  data = {}
}

export class ControlPacket extends Packet {
  type = "control"
  data = {
    throttle: 0,
    roll: 0,
    pitch: 0,
    yaw: 0,
    armed: true
  }
}
