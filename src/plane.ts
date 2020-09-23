import './controlSurface'
import { ControlSurface, ControlSurfaceBounds } from './controlSurface'
import * as pwm from './pwm'
import Esc from './esc'

const pwmHat = new pwm.Hat(50)
const esc = new Esc(pwmHat, 0)
const leftAileron = new ControlSurface(ControlSurfaceBounds.Aileron, pwmHat, 1)
const rightAileron = new ControlSurface(ControlSurfaceBounds.Aileron, pwmHat, 2)
const elevator = new ControlSurface(ControlSurfaceBounds.Elevator, pwmHat, 3)
const rudder = new ControlSurface(ControlSurfaceBounds.Rudder, pwmHat, 4)


console.log('hello plane!')

