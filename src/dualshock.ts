import HID from 'node-hid'

const DUALSHOCK_VENDOR_ID = 1356
const DUALSHOCK_PRODUCT_ID = 1476

const devices = HID.devices()

export interface DualshockState {
  joystick: {
    left: {
      x: number
      y: number
    }
    right: {
      x: number
      y: number
    }
  }
  trigger: {
    left: number
    right: number
  }
  button: {
    triangle: boolean
    circle: boolean
    cross: boolean
    square: boolean
    pad: {
      up: boolean
      right: boolean
      down: boolean
      left: boolean
    }
    joystick: {
      right: boolean
      left: boolean
    }
    options: boolean
    share: boolean
    trigger: {
      left: boolean
      right: boolean
    }
    bumper: {
      left: boolean
      right: boolean
    }
    touchpad: boolean
    playstation: boolean
  }
}

const AXIS_MAP = [
  null, 
  'joystick.left.x', 'joystick.left.y', 
  'joystick.right.x', 'joystick.right.y', 
  null, null, null,
  'trigger.left', 'trigger.right'
]

const BUTTON_MAP = [
  'triangle', 'circle', 'cross', 'square', 
  null, null, null, null, 
  'joystick.right', 'joystick.left', 
  'options', 'share', 
  'trigger.right', 'trigger.left', 
  'bumper.right', 'bumper.left',
  null, null, null, null, null, null,
  'touchpad', 'playstation'
]

const DPAD_MAP: {[key: string]: boolean[]} = {
  '0000': [true, false, false, false],
  '0001': [true, true, false, false],
  '0010': [false, true, false, false],
  '0011': [false, true, true, false],
  '0100': [false, false, true, false],
  '0101': [false, false, true, true],
  '0110': [false, false, false, true],
  '0111': [true, false, false, true],
  '1000': [false, false, false, false],
}

export default class Dualshock {
  private readonly device: HID.HID = this.findDevice()

  async readState() {
    return new Promise<DualshockState>((resolve, reject) => {
      this.device.read((error, data: unknown) => {
        if (error) reject(new Error('failed to read from hid device'))
        resolve(this.createDataObject(data as Buffer))
      })
    })
  }

  private findDevice() {
    const foundDevice = devices.find(device => device.vendorId == DUALSHOCK_VENDOR_ID && device.productId == DUALSHOCK_PRODUCT_ID)
    if (foundDevice && foundDevice.path) return new HID.HID(foundDevice.path)
    else throw new Error('failed to find dualshock device')
  }

  private createDataObject(data: Buffer): DualshockState {
    const buttonData = data.readUIntBE(5, 3).toString(2).padStart(24, '0')
    const padData = DPAD_MAP[buttonData.slice(4, 8)]

    return {
      joystick: {
        left: {
          x: data.readUInt8(AXIS_MAP.indexOf('joystick.left.x')),
          y: data.readUInt8(AXIS_MAP.indexOf('joystick.left.y'))
        },
        right: {
          x: data.readUInt8(AXIS_MAP.indexOf('joystick.right.x')),
          y: data.readUInt8(AXIS_MAP.indexOf('joystick.right.y'))
        }
      },
      trigger: {
        left: data.readUInt8(AXIS_MAP.indexOf('trigger.left')),
        right: data.readUInt8(AXIS_MAP.indexOf('trigger.right'))
      },
      button: {
        triangle: buttonData.charAt(BUTTON_MAP.indexOf('triangle')) == '1',
        circle: buttonData.charAt(BUTTON_MAP.indexOf('circle')) == '1',
        cross: buttonData.charAt(BUTTON_MAP.indexOf('cross')) == '1',
        square: buttonData.charAt(BUTTON_MAP.indexOf('square')) == '1',
        pad: {
          up: padData[0],
          right: padData[1],
          down: padData[2],
          left: padData[3]
        },
        joystick: {
          right: buttonData.charAt(BUTTON_MAP.indexOf('joystick.right')) == '1',
          left: buttonData.charAt(BUTTON_MAP.indexOf('joystick.left')) == '1'
        },
        options: buttonData.charAt(BUTTON_MAP.indexOf('options')) == '1',
        share: buttonData.charAt(BUTTON_MAP.indexOf('share')) == '1',
        trigger: {
          left: buttonData.charAt(BUTTON_MAP.indexOf('trigger.left')) == '1',
          right: buttonData.charAt(BUTTON_MAP.indexOf('trigger.right')) == '1'
        },
        bumper: {
          left: buttonData.charAt(BUTTON_MAP.indexOf('bumper.left')) == '1',
          right: buttonData.charAt(BUTTON_MAP.indexOf('bumper.right')) == '1'
        },
        touchpad: buttonData.charAt(BUTTON_MAP.indexOf('touchpad')) == '1',
        playstation: buttonData.charAt(BUTTON_MAP.indexOf('playstation')) == '1'
      }
    }
  }
}
