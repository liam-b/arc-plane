const PACKET_META_LENGTH = 9

export enum PacketIdentifier {
  PING_PACKET_IDENTIFIER,
  CONTROL_PACKET_IDENTIFIER
}

export default abstract class Packet {
  timestamp: number = Date.now()
  abstract identifier: PacketIdentifier
  abstract data: any

  static serialize(packet: Packet): Buffer {
    const data = Packet.extractDataToArray(packet.data)
    
    const meta = Buffer.alloc(PACKET_META_LENGTH)
    meta.writeUInt8(packet.identifier)
    meta.writeBigUInt64BE(BigInt(packet.timestamp), 1)

    return Buffer.concat([meta, Buffer.from(data)])
  }

  private static extractDataToArray(object: any, data: any[] = []): any[] {
    Object.values(object).forEach((value) => {
      if (typeof value === 'object') Packet.extractDataToArray(value, data)
      else {
        if (typeof value === 'boolean') data.push(value ? 1 : 0)
        else data.push(value)
      }
    })

    return data
  }

  static deserialize(buffer: Buffer): ControlPacket | PingPacket | null {
    const identifier = buffer.readUInt8()
    const timestamp = Number(buffer.readBigUInt64BE(1))
    const data = Array.from(buffer.slice(PACKET_META_LENGTH))

    const packet = Packet.getPacketOfType(identifier)
    if (!packet) return null

    Packet.insertDataFromArray(packet.data, data)
    packet.timestamp = timestamp
    return packet
  }

  private static getPacketOfType(identifier: PacketIdentifier): Packet | null {
    switch (identifier) {
      case PacketIdentifier.PING_PACKET_IDENTIFIER:
        return new PingPacket()
      case PacketIdentifier.CONTROL_PACKET_IDENTIFIER:
        return new ControlPacket()
      default:
        return null
    }
  }

  private static insertDataFromArray(object: any, data: number[]) {
    Object.entries(object).forEach(([key, value]) => {
      if (typeof value === 'object') Packet.insertDataFromArray(value, data)
      else {
        if (typeof value === 'boolean') object[key] = !!data.pop()
        else object[key] = Number(data.shift())
      }
    })
  }
}

import PingPacket from './pingPacket'
import ControlPacket from './controlPacket'
