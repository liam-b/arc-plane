import time
import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
from adafruit_bus_device.i2c_device import I2CDevice

# Create the I2C bus
i2c = busio.I2C(board.SCL, board.SDA)

# Create the ADC object using the I2C bus
ads = ADS.ADS1115(i2c, 1)

# ads._conversion_value = lambda a: print(a)

# print(ads._write_register)

# ads._write_register = lambda a, b: print('write:', a, b)

# def read(a):
#   print(a)
#   return 0

# ads._read_register = read

# Create single-ended input on channel 0
chan = AnalogIn(ads, ADS.P1)

# print(ads.get_last_result())
# print(ads._conversion_value(ads.get_last_result()))
# print(ads._read(1))

# ads._conversion_value = lambda a: print('input:', a)

# with ads.i2c_device as i2c:
#     i2c.write_then_readinto(bytearray([0]), ads.buf, in_end=2)
#     print(ads.buf[0] << 8 | ads.buf[1])

# Create differential input between channel 0 and 1
#chan = AnalogIn(ads, ADS.P0, ADS.P1)

print("{:>5}\t{:>5}".format('raw', 'v'))

while True:
    print("{:>5}\t{:>5.3f}".format(chan.value, chan.voltage))
    time.sleep(0.1)
