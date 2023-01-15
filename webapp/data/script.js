const chartHumidElement = document.getElementById('chartHumid');
const chartTempElement = document.getElementById('chartTemp');
const chartPressureElement = document.getElementById('chartPressure');
const chartGasElement = document.getElementById('chartGas');

const humidData = [];
const tempData = [];
const pressureData = [];
const gasData = [];

const humidLabels = [];
const tempLabels = [];
const pressureLabels = [];
const gasLabels = [];

var humidityMax = 100;
var tempMax = 30;
var pressureMax = 1200;
var gasMax = 300;
var tempMin = 60;
var pressureMin = 1300;
var gasMin = 200;
var humidityMin = 100;

const chartHumid = {
  labels: humidLabels,
  datasets: [
    {
      label: 'Humidity',
      data: humidData,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgb(255, 99, 132)',
    }
  ]
};

const chartTemp = {
  labels: tempLabels,
  datasets: [
    {
      label: 'Temperature',
      data: tempData,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgb(255, 99, 132)',
    }
  ]
};

const chartPressure = {
  labels: pressureLabels,
  datasets: [
    {
      label: 'Pressure',
      data: pressureData,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgb(255, 99, 132)',
    }
  ]
};

const chartGas = {
  labels: gasLabels,
  datasets: [
    {
      label: 'Gas',
      data: gasData,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgb(255, 99, 132)',
    }
  ]
};

var chartTempConfig = {
  type: 'line',
  data: chartTemp,
  options: {
    responsive: true,
    scales: {
      x: {
        min: 0,
        max: 100,
      },
      y: {
        min: 0,
        max: tempMax,
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Temperature'
      }
    }
  },
};

var chartPressureConfig = {
  type: 'line',
  data: chartPressure,
  options: {
    responsive: true,
    scales: {
      x: {
        min: 0,
        max: 100,
      },
      y: {
        min: 0,
        max: pressureMax,
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Pressure'
      }
    }
  },
};

var chartGasConfig = {
  type: 'line',
  data: chartGas,
  options: {
    responsive: true,
    scales: {
      x: {
        min: 0,
        max: 100,
      },
      y: {
        min: 0,
        max: gasMax,
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gas'
      }
    }
  },
};


var chartHumidConfig = {
  type: 'line',
  data: chartHumid,
  options: {
    responsive: true,
    scales: {
      x: {
        min: 0,
        max: 100,
      },
      y: {
        min: 0,
        max: humidityMax,
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Humidity'
      }
    }
  },
};


var humidity = new Chart(chartHumidElement, chartHumidConfig);
var temp = new Chart(chartTempElement, chartTempConfig);
var pressure = new Chart(chartPressureElement, chartPressureConfig);
var gas = new Chart(chartGasElement, chartGasConfig);

function updateTemp(tempVal) {
  const d = new Date();
  let timeStamp = d.toLocaleTimeString();
  if (tempData.length > 50) {
    tempData.shift();
    tempData.push(tempVal);
    tempLabels.shift();
    tempLabels.push(timeStamp);
  } else {
    tempData.push(tempVal);
    tempLabels.push(timeStamp);
  }
  temp.update('none');
}

function updatePressure(pressureVal) {
  const d = new Date();
  let timeStamp = d.toLocaleTimeString();
  if (pressureData.length > 50) {
    pressureData.shift();
    pressureData.push(pressureVal);
    pressureLabels.shift();
    pressureLabels.push(timeStamp);
  } else {
    pressureData.push(pressureVal);
    pressureLabels.push(timeStamp);
  }
  pressure.update('none');
}

function updateGas(gasVal) {
  const d = new Date();
  let timeStamp = d.toLocaleTimeString();
  if (gasData.length > 50) {
    gasData.shift();
    gasData.push(gasVal);
    gasLabels.shift();
    gasLabels.push(timeStamp);
  } else {
    gasData.push(gasVal);
    gasLabels.push(timeStamp);
  }
  gas.update('none');
}

function updateHumid(humidVal) {
  const d = new Date();
  let timeStamp = d.toLocaleTimeString();
  if (humidData.length > 50) {
    humidData.shift();
    humidData.push(humidVal);
    humidLabels.shift();
    humidLabels.push(timeStamp);
  } else {
    humidData.push(humidVal);
    humidLabels.push(timeStamp);
  }
  humidity.update('none');
}

function parentWidth(elem) {
  return elem.parentElement.clientWidth;
}

function parentHeight(elem) {
  return elem.parentElement.clientHeight;
}

// Create events for the sensor readings
if (!!window.EventSource) {
  var source = new EventSource('/events');

  source.addEventListener('open', function (e) {
    console.log("Events Connected");
  }, false);

  source.addEventListener('error', function (e) {
    if (e.target.readyState != EventSource.OPEN) {
      console.log("Events Disconnected");
    }
  }, false);


  // grab Sensor Data
  source.addEventListener('Box1_Sensors', function (e) {
    var obj = JSON.parse(e.data);
    var tempColor = "list-group-item-success";
    var humidColor = "list-group-item-success";
    // var pressureColor = "list-group-item-success";
    // var gasColor = "list-group-item-success";

    const tempLow = 20;
    const tempHigh = 30;
    const humidLow = 70;
    const waterHigh = 90;
    const waterMed = 50;
    const waterLow = 10;


    document.getElementById("temp").innerHTML = obj.b1Temp.toFixed(2);
    document.getElementById("humid").innerHTML = obj.b1Humidity.toFixed(2);
    document.getElementById("pressure").innerHTML = obj.b1Pressure.toFixed(2);
    document.getElementById("gas").innerHTML = obj.b1Gas.toFixed(2);
    document.getElementById("tempList").innerHTML = obj.b1Temp.toFixed(2);
    document.getElementById("humidList").innerHTML = obj.b1Humidity.toFixed(2);
    document.getElementById("pressureList").innerHTML = obj.b1Pressure.toFixed(2);
    document.getElementById("gasList").innerHTML = obj.b1Gas.toFixed(2);

    document.getElementById("minTemp").innerHTML = obj.b1TempMin.toFixed(2);
    document.getElementById("maxTemp").innerHTML = obj.b1TempMax.toFixed(2);
    document.getElementById("minHumid").innerHTML = obj.b1HumidityMin.toFixed(2);
    document.getElementById("maxHumid").innerHTML = obj.b1HumidityMax.toFixed(2);
    document.getElementById("minPressure").innerHTML = obj.b1PressureMin.toFixed(2);
    document.getElementById("maxPressure").innerHTML = obj.b1PressureMax.toFixed(2);
    document.getElementById("minGas").innerHTML = obj.b1GasMin.toFixed(2);
    document.getElementById("maxGas").innerHTML = obj.b1GasMax.toFixed(2);
    document.getElementById("b1WaterLevel").innerHTML = obj.b1WaterLevel;

    if (obj.b1Temp < tempLow) {
      tempColor = "list-group-item-primary";
    } else if (obj.b1Temp > tempHigh) {
      tempColor = "list-group-item-danger";
    } else { tempColor = "list-group-item-success"; }

    if (obj.b1Humidity < humidLow) {
      humidColor = "list-group-item-danger";
    } else { humidColor = "list-group-item-success"; }

    if (obj.b1WaterLevel > waterMed) {
      document.getElementById("b1WaterBar").classList.add("bg-success");
      document.getElementById("b1WaterBar").classList.remove("bg-warning");
      document.getElementById("b1WaterBar").classList.remove("bg-danger");
    } else if (obj.b1WaterLevel < waterMed) {
      document.getElementById("b1WaterBar").classList.add("bg-warning");
      document.getElementById("b1WaterBar").classList.remove("bg-success");
      document.getElementById("b1WaterBar").classList.remove("bg-danger");
    } else if (obj.b1WaterLevel < waterLow) {
      document.getElementById("b1WaterBar").classList.add("bg-danger");
      document.getElementById("b1WaterBar").classList.remove("bg-success");
      document.getElementById("b1WaterBar").classList.remove("bg-warning");
    }

    document.getElementById("b1WaterBar").ariaValueNow = obj.b1WaterLevel;
    document.getElementById("b1WaterBar").style =  "width: " + obj.b1WaterLevel + "%;";
    document.getElementById("tempItem").classList.add(tempColor);
    document.getElementById("humidItem").classList.add(humidColor);

  }, false);

  // grab Sensor Data
  source.addEventListener('Box1_Chart', function (e) {
    var obj = JSON.parse(e.data);
    document.getElementById("temp").innerHTML = obj.b1Temp.toFixed(2);
    document.getElementById("humid").innerHTML = obj.b1Humidity.toFixed(2);
    document.getElementById("pressure").innerHTML = obj.b1Pressure.toFixed(2);
    document.getElementById("gas").innerHTML = obj.b1Gas.toFixed(2);

    updateHumid(obj.b1Humidity.toFixed(2));
    updateTemp(obj.b1Temp.toFixed(2));
    updatePressure(obj.b1Pressure.toFixed(2));
    updateGas(obj.b1Gas.toFixed(2));
  }, false);

  // grab B1 Status
  source.addEventListener('Box1_Status', function (e) {
    var obj = JSON.parse(e.data);

    if (obj.mister == "ON") {
      document.getElementById("mistButton").setAttribute("value", "OFF");
      document.getElementById("misterStatus").innerHTML = "off";
      document.getElementById("mistButton").classList.add("list-group-item-danger");
    } else if (obj.mister == "OFF") {
      document.getElementById("mistButton").setAttribute("value", "ON");
      document.getElementById("misterStatus").innerHTML = "on";
      document.getElementById("mistButton").classList.add("list-group-item-success");
    }
  }, false);

}

function mister(element) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/mister/" + element.value, true);
  console.log(element.value);
  xhr.send();
  if (element.value == "ON") {
    document.getElementById("mistButton").setAttribute("value", "OFF");
    document.getElementById("mistButton").innerHTML = "Turn Mister off";
  } else {
    document.getElementById("mistButton").setAttribute("value", "ON");
    document.getElementById("mistButton").innerHTML = "Turn Mister on";
  }
}


