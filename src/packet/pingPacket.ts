import Packet, { PacketIdentifier } from './packet'

export default class PingPacket extends Packet {
  identifier = PacketIdentifier.PING_PACKET_IDENTIFIER
  data = {}
}
