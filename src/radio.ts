import { Packet } from './packet'
import SerialPort from 'serialport'
import logger from './log'

const DEVICE_PATH = '/dev/tty.SLAB_USBtoUART'
const BAUD_RATE = 57600

const METRIC_HISTORY_LENGTH = 100

export default class {
  private readonly port: SerialPort
  private readonly parser: SerialPort.parsers.Readline

  private lastPacketTime: number = Date.now()
  readonly intervalHistory: number[] = new Array(METRIC_HISTORY_LENGTH).fill(0)
  readonly latencyHistory: number[] = new Array(METRIC_HISTORY_LENGTH).fill(0)
  readonly badPacketHistory: boolean[] = new Array(METRIC_HISTORY_LENGTH).fill(false)

  constructor() {
    this.port = new SerialPort(DEVICE_PATH, { baudRate: BAUD_RATE }, error => {
      logger.err(error)
      logger.err(`failed to open port at ${DEVICE_PATH}`)
    })
    this.parser = this.port.pipe(new SerialPort.parsers.Readline({ delimiter: '\n' }))
  }

  send(packet: Packet) {
    this.port.write(Packet.serialize(packet) + '\n', _ => {
      logger.err('failed to send radio packet')
    })
  }

  onData(callback: (data: Packet) => void) {
    this.parser.on('data', (input: string) => {
      let packet = Packet.deserialize(input)
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

      let latency = now - packet.time
      this.latencyHistory.push(isNaN(latency) ? 0 : latency)
      this.latencyHistory.shift()
    }
  }
}
