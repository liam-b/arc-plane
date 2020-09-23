import * as pwm from './pwm'
import Servo from './servo'

// FIXME: this is a static tuning system, maybe have some way of trimming this during flight?
export class ControlSurfaceBounds {
  static readonly Aileron = new ControlSurfaceBounds(-0.5, 0, 0.5)
  static readonly Elevator = new ControlSurfaceBounds(-0.5, 0, 0.5)
  static readonly Rudder = new ControlSurfaceBounds(-0.5, 0, 0.5)

  readonly minPosition: number
  readonly centerPosition: number
  readonly maxPosition: number

  readonly normalRange: number

  constructor(minPosition: number, centerPosition: number, maxPosition: number) {
    this.minPosition = minPosition
    this.centerPosition = centerPosition
    this.maxPosition = maxPosition

    this.normalRange = Math.min(
      Math.abs(this.minPosition - this.centerPosition),
      Math.abs(this.maxPosition - this.centerPosition)
    )
  }
}

export class ControlSurface extends Servo {
  readonly bounds: ControlSurfaceBounds
  position: number = 0
  positionOffset: number = 0

  constructor(bounds: ControlSurfaceBounds, pwmHat: pwm.Hat, channel: pwm.Channel) {
    super(pwmHat, channel)
    this.bounds = bounds
  }

  setPosition(newPosition: number) {
    newPosition = Math.max(-1, Math.min(newPosition, 1))
    this.position = newPosition * (this.bounds.normalRange - this.bounds.centerPosition) + this.bounds.centerPosition; // scale from between -1 and 1 to within normal bounds
    let position = Math.max(this.bounds.minPosition, Math.min(this.position + this.positionOffset, this.bounds.maxPosition)) // clamp extended range (outside -1 to 1) at min and max positions
    super.setPosition(position)
  }

  recenter() {
    let position = Math.max(this.bounds.minPosition, Math.min(this.bounds.centerPosition + this.positionOffset, this.bounds.maxPosition))
    super.setPosition(position)
  }
}
