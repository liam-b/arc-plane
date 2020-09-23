import i2c from "i2c-bus"

const bus = i2c.openSync(1)

export class Device {
  public readonly address: number

  constructor(address: number) {
    this.address = address
  }

  write(register: number, data: number) {
    bus.writeByteSync(this.address, register, data)
  }

  read(register: number): number {
    return bus.readByteSync(this.address, register)
  }
}
