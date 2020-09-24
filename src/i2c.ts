import i2c from 'i2c-bus'

const bus = i2c.openSync(1)

export class Device {
  public readonly address: number

  constructor(address: number) {
    this.address = address
  }

  writeByte(register: number, data: number) {
    bus.writeByteSync(this.address, register, data)
  }

  writeWord(register: number, data: number) {
    bus.writeWordSync(this.address, register, data)
  }

  readByte(register: number): number {
    return bus.readByteSync(this.address, register)
  }

  readWord(register: number): number {
    return bus.readWordSync(this.address, register)
  }
}
