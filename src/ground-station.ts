import Controller from './controller'
import Packet from './packet/packet'
import ControlPacket from './packet/controlPacket'
import Radio, { RadioPath } from './radio'
import { DS4Controller } from './controller'

const radio = new Radio(RadioPath.GROUND)

// console.log(packet)
// console.log(Packet.serialize(packet))
// console.log(Packet.deserialize(Packet.serialize(packet)))
// radio.send(packet)

const controller = new DS4Controller()

setInterval(async () => {
  // const packet = new ControlPacket({
  //   throttle: 34,
  //   roll: 12,
  //   pitch: 54,
  //   yaw: -56,
  //   armed: true
  // })
  // radio.send(packet)
  // console.log(packet)
  // console.log((await controller.getControlData()).pitch)
  // let serialized = Packet.serialize(packet)
  // console.log(serialized)
  // let newPacket = Packet.deserialize(serialized)
  // console.log(newPacket instanceof ControlPacket)
  // console.log(newPacket instanceof PingPacket)
  // console.log(newPacket instanceof Packet)
  // console.log(typeof(newPacket))

  // if (newPacket && newPacket.type === 'ping') {
  //   if (newPacket.kind === 'c') newPacket.data
  //   newPacket.data
  // }

  // if (newPacket instanceof ControlPacket) {
  //   console.log(newPacket.data)
  // } else console.log('no control packet')

  // console.log(testo.data.throttle.toFixed(2))

  // const packet = new TestPacket({ one: 10, two: { three: 30 }, four: 40 })
  const packet = new ControlPacket(await controller.getControlData())
  console.log(packet)
  const buf = Packet.serialize(packet)
  console.log(buf)
  console.log(Packet.deserialize(buf))
}, 100)
