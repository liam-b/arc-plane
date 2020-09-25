interface Packet {
  time: number,
  type: string,
  data: { [key: string]: any }
}

interface PingPacket extends Packet {
  type: "ping",
}

interface ControlPacket extends Packet {
  type: "control",
  data: {
    throttle: number,
    roll: number
    pitch: number
    yaw: number
    armed: boolean
  }
}
