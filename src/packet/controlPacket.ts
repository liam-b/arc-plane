import Packet, { PacketIdentifier } from './packet'
import { ControlData } from '../controller'

export default class ControlPacket extends Packet {
  identifier = PacketIdentifier.CONTROL_PACKET_IDENTIFIER
  data: ControlData = {
    throttle: 0,
    roll: 0,
    pitch: 0,
    yaw: 0,
    flaps: 0,
    armed: false
  }

  constructor(data?: ControlData) {
    super()

    if (data) this.data = data
  }
}
