import * as i2c from './i2c'

const DEFAULT_ADDRESS = 0x40
const DEFAULT_FREQUENCY = 60

const MODE1 = 0x00
const MODE2 = 0x01
const SUBADR1 = 0x02
const SUBADR2 = 0x03
const SUBADR3 = 0x04
const PRESCALE = 0xfe

const ON_L = 0x06
const ON_H = 0x07
const OFF_L = 0x08
const OFF_H = 0x09

const ALL_ON_L = 0xfa
const ALL_ON_H = 0xfb
const ALL_OFF_L = 0xfc
const ALL_OFF_H = 0xfd

const RESTART = 0x80
const SLEEP = 0x10
const ALLCALL = 0x01
const INVRT = 0x10
const OUTDRV = 0x04

export class Hat {
  private readonly device: i2c.Device

  constructor(private frequency: number = DEFAULT_FREQUENCY, address: number = DEFAULT_ADDRESS) {
    this.device = new i2c.Device(address)

    this.device.write(MODE2, OUTDRV)
    this.device.write(MODE1, ALLCALL)
    let mode1 = this.device.read(MODE1)
    mode1 = mode1 & (~mode1)
    this.device.write(MODE1, mode1)

    this.setupMode()
  }

  private setupMode() {
    let oldmode = this.device.read(MODE1)
    let newmode = (oldmode & 0x7f) | 0x10

    this.device.write(MODE1, newmode)
    this.device.write(PRESCALE, 0x7a)
    this.device.write(MODE1, oldmode)
    this.device.write(MODE1, oldmode | 0x80)
  }

  setChannelDutyCycle(channel: Channel, dutyCycle: number) {    
    let scaledDutyCycle = Math.max(Math.min(dutyCycle * 40.96, 4095), 0)

    this.device.write(OFF_L + 4 * channel, scaledDutyCycle & 0xff)
    this.device.write(OFF_H + 4 * channel, scaledDutyCycle >> 8)
    this.device.write(ON_L + 4 * channel, 0 & 0xff)
    this.device.write(ON_H + 4 * channel, 0 >> 8)
  }
}

export class Device {
  private readonly hat: Hat
  readonly channel: Channel

  constructor(hat: Hat, channel: Channel) {
    this.hat = hat
    this.channel = channel
  }

  setDutyCycle(dutyCycle: number) {
    this.hat.setChannelDutyCycle(this.channel, dutyCycle)
  }
}

export type Channel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15
