#include <Arduino.h>
#include <Wire.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <Arduino_JSON.h>
#include "SPIFFS.h"
#include <Adafruit_Sensor.h>
#include "Adafruit_BME680.h"

// Replace with your network credentials
const char *ssid = "KingStan";
const char *password = "ST4NL333";

// setup mister/fan relay
const int misterRelay = 16;

// Setup delays
unsigned long lastTime = 0;
unsigned long lastTimeChart = 0;
unsigned long lastTimeSensor = 0;
unsigned long sensorDelay = 1000;
unsigned long chartDelay = 30000;

// BME680 Sensor
#define SEALEVELPRESSURE_HPA (1013.25) // Change this to your local sea level pressure in hPa if you want to calculate altitude
Adafruit_BME680 bme; // I2C

// Water level sensor
int waterLevelMin = 0;  // This is the raw value of the sensor when the water is at the bottom of the tank
int waterLevelMax = 150; // This is the raw value of the sensor when the water is at the top of the tank

const int waterLevelInput = 34;
const int waterLevelOutput = 27;
int b1WaterLevelRaw = 0;
int b1WaterLevel = 0;

// Create AsyncWebServer object on port 80
AsyncWebServer server(80);

// Create an Event Source on /events
AsyncEventSource events("/events");

// Box 1 Sensor Data
float b1Temp = 0;
float b1Humidity = 0;
float b1Pressure = 0;
float b1Gas = 0;
float b1TempMin = 0;
float b1TempMax = 0;
float b1HumidityMin = 0;
float b1HumidityMax = 0;
float b1PressureMin = 0;
float b1PressureMax = 0;
float b1GasMin = 0;
float b1GasMax = 0;

JSONVar b1SensorDoc;
String b1SensorString;

JSONVar b1StatusDoc;
String b1StatusString;

int checkWater() { // This water level sensor sucks, may just change it out for a float switch
  int level1 = 0;
  int level2 = 0;
  int level3 = 0;

  digitalWrite(waterLevelOutput, HIGH); // Turn on the water sensor
  delay(1000); // Wait for the sensor to settle
  level1 = analogRead(waterLevelInput); // Read the water sensor
  delay(100);
  level2 = analogRead(waterLevelInput); // Read the water sensor
  delay(100);
  level3 = analogRead(waterLevelInput); // Read the water sensor
  b1WaterLevelRaw = (level1 + level2 + level3) / 3; // Average the readings
  digitalWrite(waterLevelOutput, LOW); // Turn off the water sensor
  b1WaterLevel = map(b1WaterLevelRaw, waterLevelMin, waterLevelMax, 0, 100); // Map the raw value to a percentage
  return b1WaterLevel;
}

String sendB1Sensors()
{
  // Tell BME680 to begin measurement.
  unsigned long endTime = bme.beginReading();
  if (endTime == 0)
  {
    Serial.println(F("Failed to begin reading :("));
    return "Failed to begin reading";
  }

  if (!bme.endReading())
  {
    Serial.println(F("Failed to complete reading :("));
    return "Failed to complete reading";
  }

  b1Temp = bme.temperature;            // in degrees Celsius (the default)
  b1Humidity = bme.humidity;           // in % relative humidity (the default)
  b1Pressure = bme.pressure / 100.0;   // in hectopascals (hPa)
  b1Gas = bme.gas_resistance / 1000.0; // in KOhms

  b1SensorDoc["b1Temp"] = b1Temp;
  b1SensorDoc["b1Humidity"] = b1Humidity;
  b1SensorDoc["b1Pressure"] = b1Pressure;
  b1SensorDoc["b1Gas"] = b1Gas;

  if (b1TempMin == 0 || b1TempMin > b1Temp)
  {
    b1TempMin = b1Temp;
  }

  if (b1TempMax == 0 || b1TempMax < b1Temp)
  {
    b1TempMax = b1Temp;
  }

  if (b1HumidityMin == 0 || b1HumidityMin > b1Humidity)
  {
    b1HumidityMin = b1Humidity;
  }

  if (b1HumidityMax == 0 || b1HumidityMax < b1Humidity)
  {
    b1HumidityMax = b1Humidity;
  }

  if (b1PressureMin == 0 || b1PressureMin > b1Pressure)
  {
    b1PressureMin = b1Pressure;
  }

  if (b1PressureMax == 0 || b1PressureMax < b1Pressure)
  {
    b1PressureMax = b1Pressure;
  }

  if (b1GasMin == 0 || b1GasMin > b1Gas)
  {
    b1GasMin = b1Gas;
  }

  if (b1GasMax == 0 || b1GasMax < b1Gas)
  {
    b1GasMax = b1Gas;
  }

  b1SensorDoc["b1TempMin"] = b1TempMin;
  b1SensorDoc["b1TempMax"] = b1TempMax;
  b1SensorDoc["b1HumidityMin"] = b1HumidityMin;
  b1SensorDoc["b1HumidityMax"] = b1HumidityMax;
  b1SensorDoc["b1PressureMin"] = b1PressureMin;
  b1SensorDoc["b1PressureMax"] = b1PressureMax;
  b1SensorDoc["b1GasMin"] = b1GasMin;
  b1SensorDoc["b1GasMax"] = b1GasMax;
  b1SensorDoc["b1WaterLevel"] = checkWater();

  b1SensorString = JSON.stringify(b1SensorDoc);
  Serial.println(b1WaterLevelRaw);
  return b1SensorString;
}

void initSPIFFS()
{
  if (!SPIFFS.begin())
  {
    Serial.println("An error has occurred while mounting SPIFFS");
  }
  Serial.println("SPIFFS mounted successfully");
}

// Initialize WiFi
void initWiFi()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("");
  Serial.println(WiFi.localIP());
}

void initBME680()
{
  while (!Serial)
    ;
  Serial.println(F("BME680 async test"));

  if (!bme.begin(0x76))
  {
    Serial.println(F("Could not find a valid BME680 sensor, check wiring!"));
    while (1)
      ;
  }

  // Set up oversampling and filter initialization
  bme.setTemperatureOversampling(BME680_OS_8X);
  bme.setHumidityOversampling(BME680_OS_2X);
  bme.setPressureOversampling(BME680_OS_4X);
  bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
  bme.setGasHeater(320, 150); // 320*C for 150 ms
}



void turnMisterOn()
{
  digitalWrite(misterRelay, HIGH);
  b1StatusDoc["mister"] = "ON";
  b1StatusString = JSON.stringify(b1StatusDoc);
  events.send(b1StatusString.c_str(), "Box1_Status", millis());
}

void turnMisterOff()
{
  digitalWrite(misterRelay, LOW);
  b1StatusDoc["mister"] = "OFF";
  b1StatusString = JSON.stringify(b1StatusDoc);
  events.send(b1StatusString.c_str(), "Box1_Status", millis());
}

void setup()
{
  Serial.begin(115200);
  // Wire.begin(SDA, SCL);
  initWiFi();
  initSPIFFS();
  initBME680();
  pinMode(misterRelay, OUTPUT); // Set the mister relay pin as an output
  pinMode(waterLevelOutput, OUTPUT); // Set the water level output pin as an output
  pinMode(waterLevelInput, INPUT); // Set the water level input pin as an input
  digitalWrite(waterLevelOutput, LOW); // Turn the water level sensor off, so it doesn't corrode fast

  // Handle Web Server
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(SPIFFS, "/index.html", "text/html"); });

  server.serveStatic("/", SPIFFS, "/");

  server.on("/mister/ON", HTTP_GET, [](AsyncWebServerRequest *request)
            {
    turnMisterOn();
    request->send(200, "text/plain", "OK"); });

  server.on("/mister/OFF", HTTP_GET, [](AsyncWebServerRequest *request)
            {
    turnMisterOff();
    request->send(200, "text/plain", "OK"); });

  // Handle Web Server Events
  events.onConnect([](AsyncEventSourceClient *client)
                   {
    if(client->lastId()){
      Serial.printf("Client reconnected! Last message ID that it got is: %u\n", client->lastId());
    }
    // send event with message "hello!", id current millis
    // and set reconnect delay to 1 second
    client->send("hello!", NULL, millis(), 10000); });
  server.addHandler(&events);

  server.begin();
}

void loop()
{
  if ((millis() - lastTime) > sensorDelay)
  {
    // Send Events to the Web Server with the Sensor Readings
    events.send(sendB1Sensors().c_str(), "Box1_Sensors", millis());
    lastTime = millis();
  }
  if ((millis() - lastTimeChart) > chartDelay)
  {
    // Send Events to the Web Server with the Sensor Readings
    events.send(sendB1Sensors().c_str(), "Box1_Chart", millis());
    lastTimeChart = millis();
  }
}