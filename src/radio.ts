import SerialPort from 'serialport'

import logger from './log'
// const sleep = require('util').promisify(setTimeout)

const port = new SerialPort('/dev/tty.SLAB_USBtoUART', {
  baudRate: 57600
}, (err) => {
  logger.err(err?.message)
})

port.on('open', () => logger.info('open'))

port.on('data', function (data) {
  logger.log("data:", data)
})

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
