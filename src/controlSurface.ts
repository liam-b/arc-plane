import * as pwm from './pwm'
import Servo from './servo'

// FIXME: this is a static tuning system, maybe have some way of trimming this during flight?

export interface ControlSurfaceProfile {
  minPosition: number,
  centerPosition: number,
  maxPosition: number,
  reversed: boolean
}

export class ControlSurface {
  private readonly servo: Servo
  
  readonly normalRange: number
  position: number = 0
  positionOffset: number = 0

  constructor(pwmHat: pwm.Hat, channel: pwm.Channel, readonly profile: ControlSurfaceProfile) {
    this.servo = new Servo(pwmHat, channel)

    this.normalRange = Math.min(
      Math.abs(profile.minPosition - profile.centerPosition),
      Math.abs(profile.maxPosition - profile.centerPosition)
    )
  }

  setPosition(newPosition: number) {
    newPosition = Math.max(-1, Math.min(newPosition, 1)) * (this.profile.reversed ? -1 : 1)
    this.position = newPosition * (this.normalRange - this.profile.centerPosition) + this.profile.centerPosition; // scale from between -1 and 1 to within normal bounds
    let position = Math.max(this.profile.minPosition, Math.min(this.position + this.positionOffset * (this.profile.reversed ? -1 : 1), this.profile.maxPosition)) // clamp extended range (outside -1 to 1) at min and max positions
    this.servo.setPosition(position)
  }

  recenter() {
    let position = Math.max(this.profile.minPosition, Math.min(this.profile.centerPosition + this.positionOffset * (this.profile.reversed ? -1 : 1), this.profile.maxPosition))
    this.servo.setPosition(position)
  }
}
