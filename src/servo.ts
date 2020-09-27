import * as pwm from './pwm'

const MIN_DUTY_CYCLE = 2
const MAX_DUTY_CYCLE = 13

export default class Servo {
  private readonly device: pwm.Device
  private position: number = 0

  constructor(pwmHat: pwm.Hat, channel: pwm.Channel) {
    this.device = new pwm.Device(pwmHat, channel)
  }

  setPosition(newPosition: number) {
    this.position = Math.max(-1, Math.min(newPosition, 1))

    let dutyCycle = (((this.position + 1) * (MAX_DUTY_CYCLE - MIN_DUTY_CYCLE)) / 2) + MIN_DUTY_CYCLE
    this.device.setDutyCycle(dutyCycle)
  }

  recenter() {
    this.setPosition(0)
  }
}
