import './controlSurface'
import { ControlSurface, ControlSurfaceBounds } from './controlSurface'
import * as pwm from './pwm'
import Esc from './esc'
import Servo from './servo'

const pwmHat = new pwm.Hat(50)
// const esc = new Esc(pwmHat, 0)
const leftAileron = new ControlSurface(pwmHat, 1, ControlSurfaceBounds.Aileron)
const rightAileron = new ControlSurface(pwmHat, 2, ControlSurfaceBounds.Aileron, true)
// const elevator = new ControlSurface(ControlSurfaceBounds.Elevator, pwmHat, 3)
// const rudder = new ControlSurface(ControlSurfaceBounds.Rudder, pwmHat, 4)

setInterval(() => {
  leftAileron.setPosition(-1)
  rightAileron.setPosition(-1)
  setTimeout(() => {
    leftAileron.setPosition(0)
    rightAileron.setPosition(0)
    setTimeout(() => {
      leftAileron.setPosition(1)
      rightAileron.setPosition(1)
    },
    1000)
  },
  1000)
}, 4000) 

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



console.log('hello plane!')

