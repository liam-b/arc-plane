import config from './config.json'
import { ControlSurface } from './controlSurface'
import * as pwm from './pwm'
import Esc from './esc'
import PowerModule from './powerModule'
import { Packet, PingPacket, ControlPacket } from './packet'
import Radio from './radio'

const pwmHat = new pwm.Hat()
const esc = new Esc(pwmHat, 0)
const leftAileron = new ControlSurface(pwmHat, 4, config.controlSurfaces.leftAileron)
const rightAileron = new ControlSurface(pwmHat, 5, config.controlSurfaces.rightAileron)
const elevator = new ControlSurface(pwmHat, 8, config.controlSurfaces.elevator)
const rudder = new ControlSurface(pwmHat, 9, config.controlSurfaces.rudder)
const powerModule = new PowerModule()
const radio = new Radio()


radio.onData((packet) => {
  
  if (packet.type == 'control') {
    const controlPacket = packet as ControlPacket
    radio.getMetrics()

    leftAileron.setPosition(controlPacket.data.roll / 100)
    rightAileron.setPosition(-controlPacket.data.roll / 100)
    elevator.setPosition(controlPacket.data.pitch / 100)
    rudder.setPosition(controlPacket.data.yaw / 100)
  } 
  // console.log(data)
  // console.log(Date.now() - data.time)
})



// import './radio'




// var t = 0
// setInterval(() => {
//   // ads.measure(0).then((res) => {
//   //   t = res
//   //   ads.measure(1).then((res) => {
//   //     console.log('A0:', '#'.repeat((t/65536) * 20).padStart(20, ' '), 'A1:', '#'.repeat((res/65536) * 20).padStart(20, ' '))
//   //   })
//   // })
//   powerModule.readCurrent().then((res) => {
//     console.log('current:', res)
//   })
// }, 50)

// ads.measure(1, '2/3').then((res) => {
//   console.log('A1 at 2/3:', res)
//   ads.measure(1, '1').then((res) => {
//     console.log('A1 at 1:', res)
//   })
// })

// const servoL = new Servo(pwmHat, 4)
// const servoR = new Servo(pwmHat, 5)
// const servoE = new Servo(pwmHat, 8)
// const servoD = new Servo(pwmHat, 9)

// let currentServo = servoL

// readlineSync.promptLoop(input => {
//   if (input.startsWith('l')) currentServo = servoL
//   if (input.startsWith('r')) currentServo = servoR
//   if (input.startsWith('e')) currentServo = servoE
//   if (input.startsWith('d')) currentServo = servoD
//   else {
//     currentServo.setPosition(parseFloat(input))
//     console.log(`moving to position ${input}`)
//   }

//   return input === 'q'
// })

// setInterval(() => {
//   leftAileron.setPosition(-1)
//   rightAileron.setPosition(-1)
//   elevator.setPosition(-1)
//   rudder.setPosition(-1)
//   setTimeout(() => {
//     leftAileron.setPosition(0)
//     rightAileron.setPosition(0)
//     elevator.setPosition(0)
//     rudder.setPosition(0)
//     setTimeout(() => {
//       leftAileron.setPosition(1)
//       rightAileron.setPosition(1)
//       elevator.setPosition(1)
//       rudder.setPosition(1)
//     },
//     1000)
//   },
//   1000)
// }, 4000) 

// setTimeout(() => {
//   leftAileron.setPosition(-1)
//   setTimeout(() => {
//     leftAileron.setPosition(1)
//     setTimeout(() => {
//       leftAileron.setPosition(0)
//       setTimeout(() => {
//         leftAileron.setPosition(-1)
//         setTimeout(() => {
//           leftAileron.setPosition(1)
//           setTimeout(() => {
//             leftAileron.setPosition(0)
//             setTimeout(() => {
//               leftAileron.setPosition(-1)
//               setTimeout(() => {
//                 leftAileron.setPosition(1)
//                 setTimeout(() => {
//                   leftAileron.setPosition(0)
//                 }, 2000)
//               }, 2000)
//             }, 2000)
//           }, 2000)
//         }, 2000)
//       }, 2000)
//     }, 2000)
//   }, 2000)
// }, 2000)



// console.log('hello plane!')

