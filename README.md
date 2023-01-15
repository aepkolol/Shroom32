# Shroom32
mycology monitoring and automation

This is the start of a project to monitor and automate a "fuiting" tub for growing mushrooms. 

I'll give some basic building instructions, but at the moment this is a very rough project I started a few days ago from parts I already had on hand. I included the fusion360 file I was buildig this in for others to edit to suit their needs if needed. Some details may be missing/lacking. Feel free to open an issue and I can clarify anything. This was also my first time using the water level sensor, it came in a kit of other parts years ago. My initial tests show it sucks. I don't feel like fixing that right now, so feel free to omit it, the code should run fine without, it'll just constantly show 0% water. 

Right now the water chamber is filled via a mountain dew bottle with a hole drilled into the cap where the water tube goes. I'll eventually make something nicer. The idea is to have water gravity fed via that tube and it should stop at the right water level as long as the tube is secured properly inside. 

The humidity is controlled by an ultrasonic mister bought off Amazon and a 5010 radial fan partially disasembled. (I may have stole this idea from the Voron 3D printer team). The monitoring is done mainly by a BME688 sensor. 
Right now the main webpage displays the humidity, temperature, pressure and gas as a KOhm value. 
It is possible to use the AI gas detection of the BME688 sensor, however I'm not entirely sure how to go about that. If someone smarter than me wants to figure that out, please do. Maybe a graph of CO2 in the fruiting chamber? Detection of unwanted bacteria growth? I dunno! It's over my head at the moment. 

## TODO:
- Store x amount of sensor values serverside to save graph data between browser refreshes
- Edit and save batch info/dates.
- Save min/max values to the SPIFFs 
- Add neopixel lighting to the inside of the fruiting chamber with adjustable time cycles
- Some way to notify user of an alarm state (temp/humidity/water, etc)
- Ability to have more than one, and link the data to a central node
- Design a gravity fed water supply to the humidifier. 

## Parts required:
- The contents of the "STL" folder 3D printed in the material of your choice (PETG prefered, a soft TPE for the gaskets)
- a 24v 5010 radial fan (TBD: Add link to exact one)
- a ultrasonic mister (TBD: Add link to exact one)
- BME688
- Water sensor (TBD: Add link to exact one)
- ESP32
- Relay module
- Buck converter
- Potentiometer (if you want fan control) <- Not the best way to do this, but how I'm doing it for now.
- 4x M3 heatset inserts
- Countersunk M3 and M2.5 screws
- A few feet of 6.5mm OD silicone tube. I had some on hand from some random Amazon DC pumps. 

## Pinouts 
You can wire this how you choose to, the pins are defined in the start of main.cpp. This is how it is default. 
- BME688
  - SDA - GPIO_21
  - SCL - GPIO_22
  - GND - GND
  - VCC - 3.3v/5v depending on sensor
  
- Relay 
  - COM - 12v in
  - NO - V+ to Ultrasonic mister and potentometer
  - NC - Not connected 
  - VCC - 5v from buck converter
  - GND - out neg from buck
  - TRIG - GPIO_16
  
- Water sensor 
  - VCC - GPIO_27
  - GND - GND of ESP32 or buck converter 
  - SENSE - GPIO_34
  
- Fan
  - V+ - Output of potentiometer
  - V- - neg of 12v input (I soldered to the IN side of the buck)
  
## Printing:
- Gaskets - Use a soft TPE material. If you don't have the ability to print TPE, you can probably use hot glue or RTV or something. You may need to edit the CAD files to adjust the fit of the bottom lid since it takes into account the gaskets. 
- Everything else - PETG is probably best. You do you though. 

## Building:
See the guide folder for basic building instructions

## Issues:
- 24v radial fan is too powerful IMO. My quick fix was to add a potentiometer to limit the voltage of the fan. This works, but isn't ideal. Since the fan isn't on 100% of the time, it should be fine. If the fan draws too much power or shorts out, it could burn out the pot. 
- Water level sensor sucks. 
- I haven't designed a mount for the BME688 sensor, mine is just hanging by the wires while I worked on the rest of the stuff. 
