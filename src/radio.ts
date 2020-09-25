import { Packet } from './packet'
import SerialPort from 'serialport'
import logger from './log'

const DEVICE_PATH = '/dev/serial0'
const BAUD_RATE = 57600

export default class {
  private readonly port: SerialPort
  private readonly parser: SerialPort.parsers.Readline

  constructor() {
    this.port = new SerialPort(DEVICE_PATH, { baudRate: BAUD_RATE }, this.errorHandler)
    this.parser = this.port.pipe(new SerialPort.parsers.Readline({ delimiter: '\n' }))
  }

  send(packet: Packet) {
    this.port.write(Packet.serialize(packet), this.errorHandler)
  }

  onData(callback: (data: Packet) => void) {
    this.parser.on('data', (input: string) => {
      try {
        let packet = Packet.deserialize(input)
        callback(packet)
      } catch (error) {
        this.errorHandler(error)
      }
    })
  }

  private errorHandler(error?: Error | null ) {
    if (error) logger.err(error)
  }
}
