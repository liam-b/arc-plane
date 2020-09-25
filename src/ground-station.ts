import { Packet, PingPacket, ControlPacket } from './packet'
import Radio from './radio'

console.log('hello ground-station!')

const radio = new Radio()

let packet = new ControlPacket()

console.log(packet)
console.log(Packet.serialize(packet))
console.log(Packet.deserialize(Packet.serialize(packet)))
// radio.send(packet)
