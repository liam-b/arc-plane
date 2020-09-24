import * as i2c from './i2c'

const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time))

const CONFIG = 0b0000000110000011 // no comparator | 1600 samples per second | single-shot mode
const CONFIG_REGISTER = 0x1
const START_CONVERSION = 0b1000000000000000
const MUX = [
  0b0100000000000000,
  0b0101000000000000,
  0b0110000000000000,
  0b0111000000000000
]

const DEFAULT_GAIN = '2/3'
const GAINS: { [key: string]: [number, number] } = {
  '2/3': [0b0000000000000000, 6.144],
  '1':   [0b0000001000000000, 4.096],
  '2':   [0b0000010000000000, 2.048],
  '4':   [0b0000011000000000, 1.024],
  '8':   [0b0000100000000000, 0.512],
  '16':  [0b0000101000000000, 0.256],
}

const DELAY = 100
const DEFAULT_ADDRESS = 0x48

export default class {
  private readonly device: i2c.Device

  constructor(address: number = DEFAULT_ADDRESS) {
    this.device = new i2c.Device(address)
  }

  async measure(mux: number, gain: string = DEFAULT_GAIN) {
    mux = MUX[mux]
    if (typeof mux === 'undefined') throw new Error('Invalid mux')

    let config = CONFIG | GAINS[gain][0] | mux | START_CONVERSION
    this.device.writeWord(CONFIG_REGISTER, this.convertToBigEndian(config))
    await sleep(DELAY)
    let value = this.convertBigEndianWordToDecimal(this.device.readWord(0x0))
    return this.convertToVoltage(value, gain)
  }

  private convertBigEndianWordToDecimal(word: number): number {
    let num = ((word & 0xff) << 8) | ((word >> 8) & 0xff)
    return ((num << 16) >> 16)
  }

  private convertToBigEndian(word: number): number {
    let num = ((word & 0xff) << 8) | ((word >> 8) & 0xff)
    return num
  }

  private convertToVoltage(raw: number, gain: string): number {
    return raw * GAINS[gain][1] / 32767
  }
}
