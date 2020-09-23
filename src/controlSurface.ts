import * as pwm from './pwm'
import Servo from './servo'

// FIXME: this is a static tuning system, maybe have some way of trimming this during flight?
export class ControlSurfaceBounds {
  static readonly LeftAileron = new ControlSurfaceBounds(-0.6, -0.05, 0.3)
  static readonly RightAileronls = new ControlSurfaceBounds(-0.6, -0.05, 0.3)
  static readonly Elevator = new ControlSurfaceBounds(-0.4, 0, 0.4)
  static readonly Rudder = new ControlSurfaceBounds(-0.4, 0, 0.4)

  readonly normalRange: number

  constructor(readonly minPosition: number, readonly centerPosition: number, readonly maxPosition: number) {
    this.normalRange = Math.min(
      Math.abs(this.minPosition - this.centerPosition),
      Math.abs(this.maxPosition - this.centerPosition)
    )
  }
}

export class ControlSurface extends Servo {
  position: number = 0
  positionOffset: number = 0

  constructor(pwmHat: pwm.Hat, channel: pwm.Channel, readonly bounds: ControlSurfaceBounds, readonly reversed: boolean = false) {
    super(pwmHat, channel)
  }

  setPosition(newPosition: number) {
    newPosition = Math.max(-1, Math.min(newPosition, 1)) * (this.reversed ? -1 : 1)
    this.position = newPosition * (this.bounds.normalRange - this.bounds.centerPosition) + this.bounds.centerPosition; // scale from between -1 and 1 to within normal bounds
    let position = Math.max(this.bounds.minPosition, Math.min(this.position + this.positionOffset * (this.reversed ? -1 : 1), this.bounds.maxPosition)) // clamp extended range (outside -1 to 1) at min and max positions
    super.setPosition(position)
  }

  recenter() {
    let position = Math.max(this.bounds.minPosition, Math.min(this.bounds.centerPosition + this.positionOffset * (this.reversed ? -1 : 1), this.bounds.maxPosition))
    super.setPosition(position)
  }
}
