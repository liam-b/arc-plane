import { Packet, PingPacket, ControlPacket } from './packet'
import Radio from './radio'

const radio = new Radio()

// console.log(packet)
// console.log(Packet.serialize(packet))
// console.log(Packet.deserialize(Packet.serialize(packet)))
// radio.send(packet)

setInterval(() => {
  radio.send(new ControlPacket())
}, 200)
