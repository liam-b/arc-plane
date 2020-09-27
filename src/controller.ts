import Dualshock from './dualshock'

// var isArmed = false
// var oldCrossButton = false

export interface ControlData {
  throttle: number
  roll: number
  pitch: number
  yaw: number
  armed: boolean
}

export abstract class Controller {
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
        throttle: this.scale(dualshockState?.joystick.left.y, true),
        roll: this.scale(dualshockState?.joystick.right.x),
        pitch: this.scale(dualshockState?.joystick.right.y),
        yaw: this.scale(dualshockState?.joystick.left.x),
        armed: true
      }
    } catch (error) {
      throw new Error('failed to read dualshock controller state')
    }
  }

  private scale(input: number, inverted?: boolean): number {
    let output = input / 255
    // return (inverted) ? -output : output
    return Math.floor(((inverted) ? -output : output) * 100)
  }
}

// setInterval(() => {
//   if (dualshock.button.cross && !oldCrossButton) isArmed = !isArmed
//   oldCrossButton = dualshock.button.cross
// }, 100)
