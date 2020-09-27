import { Controller } from './controller'
import { Packet, PingPacket, ControlPacket } from './packet'
import Radio from './radio'
import { DS4Controller } from './controller'

const radio = new Radio()

// console.log(packet)
// console.log(Packet.serialize(packet))
// console.log(Packet.deserialize(Packet.serialize(packet)))
// radio.send(packet)

const controller = new DS4Controller()

setInterval(async () => {
  // radio.send(new ControlPacket(await controller.getControlData()))
  console.log((await controller.getControlData()).pitch)
}, 100)
