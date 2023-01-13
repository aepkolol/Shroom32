# Shroom32
mycology monitoring and automation

This is the start of a project to monitor and automate a "fuiting" tub for growing mushrooms. 

The humidity is controlled by an ultrasonic mister bought off Amazon and a 5010 radial fan partially disasembled. The monitoring is done mainly by a BME688 sensor. 
Right now the main webpage displays the humidity, temperature, pressure and gas as a KOhm value. 
It is possible to use the AI gas detection of the BME688 sensor, however I'm not entirely sure how to go about that. If someone smarter than me wants to figure that out, please do. Maybe a graph of CO2 in the fruiting chamber? Detection of unwanted bacteria growth? I dunno! It's over my head at the moment. 

TODO:

- Store x amount of sensor values serverside to save graph data between browser refreshes
- Edit and save batch info/dates.
- Save min/max values to the SPIFFs 
- Add neopixel lighting to the inside of the fruiting chamber with adjustable time cycles
- Some way to notify user of an alarm state (temp/humidity/water, etc)
- Ability to have more than one, and link the data to a central node

Parts required:
- The contents of the "STL" folder 3D printed in the material of your choice (PETG prefered)
- a 5010 radial fan (TBD: Add link to exact one)
- a ultrasonic mister (TBD: Add link to exact one)
- BME688
- Water sensor (TBD: Add link to exact one)
- ESP32
- Relay module
- Buck converter

Building:
TBD
