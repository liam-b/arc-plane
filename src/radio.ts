import Packet, { PACKET_BYTES } from './packet/packet'
import SerialPort from 'serialport'
import logger from './log'

const BAUD_RATE = 57600
const METRIC_HISTORY_LENGTH = 100

export enum RadioPath {
  GROUND = '/dev/tty.SLAB_USBtoUART',
  AIR = '/dev/serial0'
}

export default class {
  private readonly port: SerialPort
  private readonly parser: SerialPort.parsers.ByteLength

  private lastPacketTime: number = Date.now()
  readonly intervalHistory: number[] = new Array(METRIC_HISTORY_LENGTH).fill(0)
  readonly latencyHistory: number[] = new Array(METRIC_HISTORY_LENGTH).fill(0)
  readonly badPacketHistory: boolean[] = new Array(METRIC_HISTORY_LENGTH).fill(false)

  constructor(devicePath: RadioPath) {
    this.port = new SerialPort(devicePath, { baudRate: BAUD_RATE }, error => {
      if (error) logger.err(`failed to open port at ${devicePath}:`, error.message)
      else logger.info('radio port opened successfully')
    })
    this.parser = this.port.pipe(new SerialPort.parsers.ByteLength({ length: PACKET_BYTES }))
  }

  send(packet: Packet) {
    this.port.write(Packet.serialize(packet), error => {
      if (error) logger.err('failed to send radio packet:', error.message)
    })
  }

  onData(callback: (data: Packet) => void) {
    this.parser.on('data', (input: string) => {
      let packet = Packet.deserialize(Buffer.from(input))
      this.updateMetrics(packet)
      if (packet != null) callback(packet)
      else logger.err('bad radio packet')
    })
  }

  getMetrics() {
    let interval = this.intervalHistory.reduce((a, b) => a + b) / METRIC_HISTORY_LENGTH
    let latency = this.latencyHistory.reduce((a, b) => a + b) / METRIC_HISTORY_LENGTH
    let badPackets = this.badPacketHistory.filter(a => a == true).length / METRIC_HISTORY_LENGTH * 100
    let frequency = 1 / interval * 1000

    logger.log(`packet freq: ${frequency.toFixed(2)} (${interval.toFixed(2)}) with avg transit latency: ${latency.toFixed(2)} and bad packets: ${badPackets.toFixed(0)}%`)
  }

  timeSinceLastPacket(): number {
    return Date.now() - this.lastPacketTime;
  }

  private updateMetrics(packet: Packet | null) {
    let now = Date.now()

    this.badPacketHistory.push(packet == null)
    this.badPacketHistory.shift()

    if (packet != null) {
      this.intervalHistory.push(now - this.lastPacketTime)
      this.intervalHistory.shift()
      this.lastPacketTime = now

      let latency = now - packet.timestamp
      this.latencyHistory.push(isNaN(latency) ? 0 : latency)
      this.latencyHistory.shift()
    }
  }
}
