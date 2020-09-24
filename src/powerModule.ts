import ADS1115 from './ads1115'

const CURRENT_MUX = 0
const VOLTAGE_MUX = 1

const CURRENT_MULTIPLIER = 28.72
const CURRENT_OFFSET = 1.13
const VOLTAGE_MULTIPLIER = 19.9

export default class {
  private readonly ads1115: ADS1115

  constructor() {
    this.ads1115 = new ADS1115()
  }

  async readCurrent() {
    return await this.ads1115.measure(CURRENT_MUX) * CURRENT_MULTIPLIER + CURRENT_OFFSET
  }

  async readVoltage() {
    return await this.ads1115.measure(VOLTAGE_MUX) * VOLTAGE_MULTIPLIER
  }
}
