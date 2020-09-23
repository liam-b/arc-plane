import * as pwm from './pwm'

const MIN_DUTY_CYCLE = 2
const MAX_DUTY_CYCLE = 13

export default class extends pwm.Device {
  position: number = 0

  constructor(pwmHat: pwm.Hat, channel: pwm.Channel) {
    super(pwmHat, channel)
  }

  setPosition(newPosition: number) {
    this.position = Math.max(-1, Math.min(newPosition, 1))

    let dutyCycle = (((this.position + 1) * (MAX_DUTY_CYCLE - MIN_DUTY_CYCLE)) / 2) + MIN_DUTY_CYCLE
    this.setDutyCycle(dutyCycle)
  }

  recenter() {
    this.setPosition(0)
  }
}
