import * as pwm from './pwm'

const MIN_DUTY_CYCLE = 5
const MAX_DUTY_CYCLE = 10

export default class ESC {
  private readonly device: pwm.Device
  private speed: number = 0

  constructor(pwmHat: pwm.Hat, channel: pwm.Channel) {
    this.device = new pwm.Device(pwmHat, channel)
    this.stop()
  }

  setSpeed(newSpeed: number) {
    this.speed = Math.max(0, Math.min(newSpeed, 1))

    let dutyCycle = ((this.speed * (MAX_DUTY_CYCLE - MIN_DUTY_CYCLE)) / 1) + MIN_DUTY_CYCLE
    this.device.setDutyCycle(dutyCycle)
  }

  stop() {
    this.setSpeed(0)
  }
}
