const COLOR = {
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m"
}

export default {
  log(...message: any[]) {
    process.stdout.write(COLOR.white)
    console.log(...message)
    process.stdout.write(COLOR.white)
  },
  
  info(...message: any[]) {
    process.stdout.write(COLOR.cyan)
    console.log(...message)
    process.stdout.write(COLOR.white)
  },
  
  warn(...message: any[]) {
    process.stdout.write(COLOR.yellow)
    console.log(...message)
    process.stdout.write(COLOR.white)
  },
  
  err(...message: any[]) {
    process.stdout.write(COLOR.red)
    console.log(...message)
    process.stdout.write(COLOR.white)
  }
}
