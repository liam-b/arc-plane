import SerialPort from 'serialport'

import logger from './log'
import { AnyAaaaRecord } from 'dns'
// const sleep = require('util').promisify(setTimeout)

const port = new SerialPort('/dev/serial0', {
  baudRate: 57600
}, (err) => {
  if (err) logger.err(err)
})

port.on('open', () => logger.info('open'))

const parser = port.pipe(new SerialPort.parsers.Readline({ delimiter: '\n' }))

const latencyHistory: number[] = new Array(50).fill(0)
const intervalHistory: number[] = new Array(50).fill(0)
var goodPackets = 0
var badPackets = 0

var old = Date.now()
parser.on('data', (data: any) => {
  // logger.log("data air:", data.toString())
  let now = Date.now()
  let json

  try {
    json = JSON.parse(data)
    latencyHistory.push(Math.abs(now - parseInt(json.time)))
    latencyHistory.shift()
    intervalHistory.push(Math.abs(now - old))
    intervalHistory.shift()
    goodPackets += 1
  } catch (err) {
    badPackets += 1
  }

  old = now
  // port.write('hello mr ground'.repeat(20) + '\n')

  // logger.log('interval:', (intervalHistory.reduce((a, b) => a + b, 0) / intervalHistory.length).toFixed(1), 'bad packets:', (badPackets / goodPackets * 100).toFixed(1) + '%')
  logger.log('latency:', (latencyHistory.reduce((a, b) => a + b, 0) / latencyHistory.length).toFixed(1), 'interval:', (intervalHistory.reduce((a, b) => a + b, 0) / intervalHistory.length).toFixed(1), 'bad packets:', (badPackets / goodPackets * 100).toFixed(1) + '%')
  // logger.log('packet [ latency:', Math.abs(now - parseInt(data)), 'interval:', Math.abs(now - old), ']')
})

port.write('hi from plane nyoom\n')
// logger.warn(SerialPort)

// const SERIAL_CHECK_INTERVAL = 5

// var lastSerialCommand = null
// const port = new serialport('/dev/tty.usbserial-0001', { // /dev/tty.SLAB_USBtoUART
//   baudRate: 57600
// }, (err) => {
//   if (err) throw 'Failed to open serial port'
// })

// const parser = port.pipe(new Delimiter({ delimiter: '\n' }))
// parser.on('data', (data) => {
//   lastSerialCommand = command.deserialize(data)
// })

// module.exports.send = async (name, data) => {
//   await port.write(command.serialize(name, data) + '\n')
//   // return await port.drain()
// }

// module.exports.read = () => {
//   let value = lastSerialCommand
//   lastSerialCommand = null
//   return value
// }

// module.exports.response = async (timeout) => {
//   const checks = timeout / SERIAL_CHECK_INTERVAL
//   let counter = 0
//   while (counter <= checks) {
//     await sleep(SERIAL_CHECK_INTERVAL)
//     if (lastSerialCommand) {
//       let value = lastSerialCommand
//       lastSerialCommand = null
//       return value
//     }
//   }
//   return null
// }

// module.exports.flush = () => {
//   lastSerialCommand = null
// }
