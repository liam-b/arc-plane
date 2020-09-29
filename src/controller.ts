import Dualshock from './dualshock'

// var isArmed = false
// var oldCrossButton = false

export interface ControlData {
  throttle: number
  roll: number
  pitch: number
  yaw: number
  flaps: number
  armed: boolean
}

export default abstract class Controller {
  abstract async getControlData(): Promise<ControlData>
}

export class DS4Controller extends Controller {
  private readonly dualshock: Dualshock

  constructor() {
    super()

    this.dualshock = new Dualshock()
  }

  async getControlData(): Promise<ControlData> {
    try {
      const dualshockState = await this.dualshock.readState()

      return {
        throttle: this.scale(dualshockState.trigger.right),
        roll: this.scale(dualshockState.joystick.right.x),
        pitch: this.scale(dualshockState.joystick.right.y),
        yaw: this.scale(dualshockState.joystick.left.x),
        flaps: this.scale(dualshockState.trigger.left),
        armed: true
      }
    } catch (error) {
      throw new Error('failed to read dualshock controller state')
    }
  }

  private scale(input: number, inverted?: boolean): number {
    // let output = input / 127 - 1
    let output = input

    // return (inverted) ? -output : output
    // if (inverted) output *= -1
    return Math.floor(output)
    // return Math.floor(output * 100)
  }
}

// setInterval(() => {
//   if (dualshock.button.cross && !oldCrossButton) isArmed = !isArmed
//   oldCrossButton = dualshock.button.cross
// }, 100)
